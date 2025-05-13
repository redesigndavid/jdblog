from datetime import UTC, datetime, timedelta
from typing import Any, Optional, Union

import bcrypt
import jwt
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

ALGORITHM = "HS256"
JWT_SECRET_KEY = "narscbjim@$@&^@&%^&RFghgjvbdsha"  # should be kept secret
JWT_REFRESH_SECRET_KEY = "13ugfdfgh@#$%^@&jkl45678902"


def get_hashed_password(password: str) -> bytes:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password=pwd_bytes, salt=salt)


def verify_password(password: str, hashed_pass: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed_pass.encode("utf-8"),
    )


def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[int] = None
) -> str:
    expires = datetime.now(UTC) + timedelta(
        minutes=expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES,
    )

    to_encode = {"exp": expires, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)

    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any], expires_delta: Optional[int] = None
) -> str:
    expires = datetime.now(UTC) + timedelta(
        minutes=expires_delta or REFRESH_TOKEN_EXPIRE_MINUTES,
    )

    to_encode = {"exp": expires, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def decodeJWT(jwtoken: str):
    try:
        # Decode and verify the token
        return jwt.decode(jwtoken, JWT_SECRET_KEY, [ALGORITHM])
    except InvalidTokenError:
        return None


class JWTBearer(HTTPBearer):
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
        valid_token: bool = False

        try:
            payload = decodeJWT(jwtoken)
        except Exception:
            payload = None
        if payload:
            valid_token = True
        return valid_token
