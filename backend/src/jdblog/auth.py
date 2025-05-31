import json
import urllib.parse
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any, Callable, Optional, Tuple, Union

import bcrypt
import jwt
import requests
import sqlalchemy.exc
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session, select

from jdblog import database
from jdblog.config import config

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
ALGORITHM = "HS256"


# Authentication router
router = APIRouter()


def get_hashed_password(password: str) -> bytes:
    """Hash password."""
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password=pwd_bytes, salt=salt)


def verify_password(password: str, hashed_pass: str) -> bool:
    """Verify that password matches hashed password."""
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed_pass.encode("utf-8"),
    )


def create_access_token(
    subject: Union[str, Any], expires_delta: int = ACCESS_TOKEN_EXPIRE_MINUTES
) -> str:
    """Create an access token."""
    expires = datetime.now(UTC) + timedelta(
        minutes=expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES,
    )

    to_encode = {"exp": expires, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode,
        config.get("JWT_SECRET_KEY"),
        ALGORITHM,
    )

    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any], expires_delta: int = REFRESH_TOKEN_EXPIRE_MINUTES
) -> str:
    """Create a refresh token."""
    expires = datetime.now(UTC) + timedelta(
        minutes=expires_delta,
    )

    to_encode = {"exp": expires, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode,
        config.get("JWT_REFRESH_SECRET_KEY"),
        ALGORITHM,
    )
    return encoded_jwt


class JWTBearer(HTTPBearer):  # pragma: no cover
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(
        self, request: Request
    ) -> Optional[HTTPAuthorizationCredentials]:
        credentials: Optional[HTTPAuthorizationCredentials] = await super(
            JWTBearer, self
        ).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme."
                )
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=403,
                    detail=f"Invalid token or expired token.",
                )
            return credentials
        else:
            raise HTTPException(
                status_code=403,
                detail="Invalid authorization code.",
            )

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            jwt.decode(jwtoken, config.get("JWT_SECRET_KEY"), [ALGORITHM])
        except InvalidTokenError:
            return False
        return True


def make_oauth():  # pragma: no cover
    oauth = OAuth(config=config)
    oauth.register(
        name="google",
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={
            "scope": "openid email profile",
            "prompt": "select_account",
        },
    )
    oauth.register(
        name="github",
        access_token_url="https://github.com/login/oauth/access_token",
        authorize_url="https://github.com/login/oauth/authorize",
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "read:user user:email"},
    )
    # oauth.register(
    #     name="facebook",
    #     client_id=FACEBOOK_CLIENT_ID,
    #     client_secret=FACEBOOK_CLIENT_SECRET,
    #     access_token_url="https://graph.facebook.com/v18.0/oauth/access_token",
    #     authorize_url="https://www.facebook.com/v18.0/dialog/oauth",
    #     api_base_url="https://graph.facebook.com/v18.0/",
    #     client_kwargs={"scope": "email public_profile"},
    # )
    # oauth.register(
    #     name="twitter",
    #     client_id=TWITTER_API_KEY,
    #     client_secret=TWITTER_API_SECRET,
    #     request_token_url="https://api.twitter.com/oauth/request_token",
    #     access_token_url="https://api.twitter.com/oauth/access_token",
    #     authorize_url="https://api.twitter.com/oauth/authorize",
    #     api_base_url="https://api.twitter.com/1.1/",
    # )
    # oauth.register(
    #     name="microsoft",
    #     server_metadata_url="https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    #     client_id=MICROSOFT_CLIENT_ID,
    #     client_secret=MICROSOFT_CLIENT_SECRET,
    #     client_kwargs={
    #         "scope": "openid email profile",
    #     },
    # )
    # oauth.register(
    #     name="linkedin",
    #     client_id=LINKEDIN_CLIENT_ID,
    #     client_secret=LINKEDIN_CLIENT_SECRET,
    #     access_token_url="https://www.linkedin.com/oauth/v2/accessToken",
    #     authorize_url="https://www.linkedin.com/oauth/v2/authorization",
    #     api_base_url="https://api.linkedin.com/v2/",
    #     client_kwargs={"scope": "r_liteprofile r_emailaddress"},
    # )
    return oauth


AuthenticatedBearer = Depends(JWTBearer(auto_error=True))


async def get_current_user(
    session: database.MakeSession,
    credentials=AuthenticatedBearer,
) -> database.User:
    """Get all the users."""
    _, user = session.exec(
        select(database.Token, database.User).where(
            database.Token.access_token == credentials.credentials,
            database.User.username == database.Token.username,
        )
    ).first()
    return user


CurrentUser = Annotated[database.User, Depends(get_current_user)]


@router.post("/register/password")
async def register_user(
    user: database.RegisterUserPassword, session: database.MakeSession
):
    # Hash the password before saving.
    password = get_hashed_password(user.password).decode()

    create_user = ensure_user(
        session,
        user.username,
        user.firstName,
        user.lastName,
        user.photo,
    )

    auth_identity = database.AuthIdentity(
        provider_user_id=user.username,
        provider=database.AuthProvider.password,
        password_hash=password,
    )
    session.add(auth_identity)

    create_user.auth_identity.append(auth_identity)
    session.add(auth_identity)

    try:
        session.commit()
    except (
        sqlalchemy.exc.IntegrityError,
        sqlalchemy.exc.PendingRollbackError,
    ) as e:
        return {"message": "Failed to create user.", "error": e.args}

    return {"message": "user created successfully"}


@router.post("/refresh")
async def refresh_token(
    session: database.MakeSession,
    token: database.RefreshToken,
):

    try:
        token_value = jwt.decode(
            token.refresh_token, config.get("JWT_REFRESH_SECRET_KEY"), [ALGORITHM]
        )
    except InvalidTokenError:
        return False
    user_name = token_value["sub"]
    try:
        matching = (
            session.exec(
                select(database.AuthIdentity).where(
                    database.AuthIdentity.provider_user_id == user_name,
                )
            )
            .unique()
            .one()
        )
    except sqlalchemy.exc.NoResultFound:
        return {"error": "No such user."}

    return create_token(session, matching)


@router.post("/login/password")
async def login_password(
    user: database.UserPassword,
    session: database.MakeSession,
    request: Request,
):
    request.session.clear()
    try:
        matching = session.exec(
            select(database.AuthIdentity)
            .where(
                database.AuthIdentity.provider_user_id == user.username,
            )
            .where(database.AuthIdentity.provider == database.AuthProvider.password)
        ).unique()
    except sqlalchemy.exc.NoResultFound:
        return {"error": "No such user."}

    for match in matching:
        if verify_password(user.password, match.password_hash or ""):

            token = create_token(session, match)

            return token
    return {"error": "Incorrect password"}


@router.get("/login/{provider}")
async def login(
    request: Request,
    oauth: Annotated[OAuth, Depends(make_oauth)],
    provider: str,
):
    redirect_path = request.query_params.get("redirect", "/")
    state = urllib.parse.quote(json.dumps({"redirect": redirect_path}))

    redirect_auth = request.url.components._replace(
        path=f"/auth/{provider}", query=None
    ).geturl()

    request.session.clear()
    oauth_provider = getattr(oauth, provider)
    return await oauth_provider.authorize_redirect(
        request,
        redirect_auth,
        state=state,
    )


def ensure_user(
    session: Session, email: str, first_name: str, last_name: str, photo: str
):

    try:
        user = (
            session.exec(select(database.User).where(database.User.username == email))
            .unique()
            .one()
        )
    except sqlalchemy.exc.NoResultFound:
        user = database.User(username=email)
        user_profile = database.Profile(
            firstName=first_name,
            lastName=last_name,
            photo=photo,
        )
        user.profile = user_profile

        session.add(user)
        session.add(user_profile)
    return user


def ensure_auth_identity(
    session: Session,
    provider: database.AuthProvider,
    email: str,
    user: database.User,
):

    try:
        auth_identity = (
            session.exec(
                select(database.AuthIdentity)
                .where(database.AuthIdentity.provider == provider)
                .where(database.AuthIdentity.provider_user_id == email)
            )
            .unique()
            .one()
        )
    except sqlalchemy.exc.NoResultFound:
        auth_identity = database.AuthIdentity(  # type: ignore
            provider=provider,
            provider_user_id=email,
        )
        user.auth_identity.append(auth_identity)
        session.add(auth_identity)
    return auth_identity


def auth_google_user_creator(
    session: Session, token: dict
) -> Tuple[database.User, database.AuthIdentity]:
    user_info = token.get("userinfo")

    if user_info is None:
        raise KeyError("userinfo not found")

    user = ensure_user(
        session,
        user_info.get("email"),
        user_info.get("given_name"),
        user_info.get("family_name"),
        user_info.get("picture"),
    )
    auth_identity = ensure_auth_identity(
        session,
        database.AuthProvider.google,
        user_info.get("email"),
        user,
    )

    return user, auth_identity


def auth_github_user_creator(
    session: Session,
    token: dict,
) -> Tuple[database.User, database.AuthIdentity]:
    emails = requests.get(
        url="https://api.github.com/user/emails",
        headers={"authorization": f"Bearer {token.get('access_token')}"},
    ).json()
    email = [email for email in emails if email.get("primary")][0]["email"]

    content = requests.get(
        url="https://api.github.com/user",
        headers={"authorization": f"Bearer {token.get('access_token')}"},
    ).json()

    user = ensure_user(
        session,
        email,
        content.get("name"),
        "",
        content.get("avatar_url"),
    )
    auth_identity = ensure_auth_identity(
        session,
        database.AuthProvider.github,
        email,
        user,
    )

    return user, auth_identity


def get_user_creator(provider: str) -> Callable:
    user_creators: dict[str, Callable] = {
        "google": auth_google_user_creator,
        "github": auth_github_user_creator,
    }
    return user_creators[provider]


@router.get("/auth/{provider}")
async def auth(
    request: Request,
    session: database.MakeSession,
    provider: str,
    oauth: Annotated[OAuth, Depends(make_oauth)],
):
    oauth_provider = getattr(oauth, provider)
    token = await oauth_provider.authorize_access_token(
        request,
    )

    # Get and decode the `state` parameter
    raw_state = request.query_params.get("state", "{}")
    state = json.loads(urllib.parse.unquote(raw_state))
    redirect_path = state.get("redirect", "/")

    user, auth_identity = get_user_creator(provider)(session, token)

    try:
        session.commit()
    except (
        sqlalchemy.exc.IntegrityError,
        sqlalchemy.exc.PendingRollbackError,
    ) as e:  # pragma: no cover
        session.rollback()
        if not session.exec(
            select(database.User).where(
                database.User.username == user.username,
            )
        ).first():
            return {"message": "Failed to create user.", "error": e.args}

    token = create_token(session, auth_identity)
    return RedirectResponse(add_params(redirect_path, dict(token)))


def add_params(url, params):
    return f"{url}?{urllib.parse.urlencode(params)}"


def create_token(session, auth_identity):

    access = create_access_token(auth_identity.provider_user_id)
    refresh = create_refresh_token(auth_identity.provider_user_id)

    token = database.Token(
        username=auth_identity.provider_user_id,
        access_token=access,
        refresh_token=refresh,
        status=True,
    )
    try:
        session.add(token)
        session.commit()
        session.refresh(token)
        return token
    except sqlalchemy.exc.IntegrityError:
        # Rollback attempt to create.
        session.rollback()

    db_token = session.get(database.Token, token.username)
    if db_token is None:  # pragma: no cover
        raise RuntimeError("Failed to create token")
    try:
        # Update token.
        token_data = token.model_dump(exclude_unset=True)
        db_token.sqlmodel_update(token_data)
        session.add(db_token)
        session.commit()
        session.refresh(db_token)
        return token
    except Exception:  # pragma: no cover
        # Rollback attempt to update.
        session.rollback()

    raise RuntimeError("Failed to create token")  # pragma: no cover
