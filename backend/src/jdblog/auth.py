import json
import pprint
import urllib.parse
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any, Callable, Optional, Union

import bcrypt
import jwt
import requests
import sqlalchemy.exc
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from sqlmodel import select

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
                    status_code=403, detail="Invalid token or expired token."
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


def get_current_user(
    session: database.MakeSession,
    credentials=AuthenticatedBearer,
):
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
    create_user = database.User(username=user.username)
    auth_identity = database.AuthIdentity(
        provider_user_id=user.username,
        provider=database.AuthProvider.password,
        password_hash=password,
    )
    user_profile = database.Profile(
        firstName=user.firstName, lastName=user.lastName, photo=user.photo
    )

    create_user.auth_identity = auth_identity
    create_user.profile = user_profile

    session.add(database.User.model_validate(create_user))

    try:
        session.commit()
    except (
        sqlalchemy.exc.IntegrityError,
        sqlalchemy.exc.PendingRollbackError,
    ) as e:
        return {"message": "Failed to create user.", "error": e.args}
    return {"message": "user created successfully"}


@router.post("/login/password")
async def login_password(
    user: database.UserPassword,
    session: database.MakeSession,
    request: Request,
):
    request.session.clear()
    try:
        matching = session.exec(
            select(database.AuthIdentity).where(
                database.AuthIdentity.provider_user_id == user.username,
            )
        ).one()
    except sqlalchemy.exc.NoResultFound:
        return {"error": "No such user."}

    if not verify_password(user.password, matching.password_hash or ""):
        return {"error": "Incorrect password"}

    token = create_token(session, matching)

    return token


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

    print(redirect_path)
    print(redirect_auth)

    request.session.clear()
    oauth_provider = getattr(oauth, provider)
    return await oauth_provider.authorize_redirect(
        request,
        redirect_auth,
        state=state,
    )


def auth_google_user_creator(token: dict) -> database.User:
    user_info = token.get("userinfo")

    if user_info is None:
        raise KeyError("userinfo not found")

    user = database.User(username=user_info.get("email"))
    auth_identity = database.AuthIdentity(  # type: ignore
        provider=database.AuthProvider.google,
        provider_user_id=user_info.get("email"),
    )
    user_profile = database.Profile(
        firstName=user_info.get("given_name"),
        lastName=user_info.get("family_name"),
        photo=user_info.get("picture"),
    )

    user.auth_identity = auth_identity
    user.profile = user_profile
    return user


def auth_github_user_creator(token: dict) -> database.User:
    emails = requests.get(
        url="https://api.github.com/user/emails",
        headers={"authorization": f"Bearer {token.get('access_token')}"},
    ).json()
    print(emails)
    email = [email for email in emails if email.get("primary")][0]["email"]

    content = requests.get(
        url="https://api.github.com/user",
        headers={"authorization": f"Bearer {token.get('access_token')}"},
    ).json()

    user = database.User(username=email)
    auth_identity = database.AuthIdentity(  # type: ignore
        provider=database.AuthProvider.github,
        provider_user_id=email,
    )
    user_profile = database.Profile(
        firstName=content.get("name"),
        lastName="",
        photo=content.get("avatar_url"),
    )

    user.auth_identity = auth_identity
    user.profile = user_profile
    return user


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

    user = get_user_creator(provider)(token)

    pprint.pprint(user)
    pprint.pprint(user.auth_identity)
    auth_identity = user.auth_identity

    # Only need to add the user, profile gets created too.
    session.add(database.User.model_validate(user))

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


@router.get("/users/me")
async def get_user(user: CurrentUser):
    """Get all the users."""
    return user
