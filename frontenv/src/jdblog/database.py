import datetime
import enum
from typing import Annotated, List, Union

from fastapi import Depends
from jdblog.config import config
from sqlalchemy import UniqueConstraint
from sqlmodel import (Column, Enum, Field, Relationship, Session, SQLModel,
                      create_engine)


class UserPassword(SQLModel):
    username: str
    password: str


class RegisterUserPassword(UserPassword):
    photo: str
    firstName: str
    lastName: str


class UserPub(SQLModel):  # type: ignore
    id: Union[int, None] = Field(default=None, primary_key=True)
    username: str
    profile: Union["Profile", None]


class User(SQLModel, table=True):  # type: ignore
    __table_args__ = (UniqueConstraint("username"),)
    id: Union[int, None] = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    profile: Union["Profile", None] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "joined"}
    )
    auth_identity: Union["AuthIdentity", None] = Relationship(
        back_populates="user", sa_relationship_kwargs={"lazy": "joined"}
    )

    posts: List["Post"] = Relationship(back_populates="owner")


class AuthProvider(str, enum.Enum):
    password = "password"
    google = "google"
    github = "github"


class AuthIdentity(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(
        default=None,
        foreign_key="user.id",
    )
    user: User | None = Relationship(
        back_populates="auth_identity",
        sa_relationship_kwargs={"lazy": "joined"},
    )
    provider: AuthProvider = Field(sa_column=Column(Enum(AuthProvider)))
    provider_user_id: str | None
    password_hash: str | None
    created_date: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class Profile(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    user_id: int | None = Field(
        default=None,
        foreign_key="user.id",
    )
    user: User | None = Relationship(
        back_populates="profile", sa_relationship_kwargs={"lazy": "joined"}
    )
    firstName: str
    lastName: str
    photo: str
    created_date: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class Token(SQLModel, table=True):
    username: str = Field(default=None, primary_key=True)
    access_token: str
    refresh_token: str
    status: bool
    created_date: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class Post(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    owner_id: int | None = Field(default=None, foreign_key="user.id")
    owner: User = Relationship(back_populates="posts")


engine = create_engine(config.get("DATABASE_URL"))


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def make_session_context():  # pragma: no cover

    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()


MakeSession = Annotated[Session, Depends(make_session_context)]


def delete_db_and_tables():
    SQLModel.metadata.drop_all(engine)
