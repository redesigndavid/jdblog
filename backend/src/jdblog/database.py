import datetime
import enum
from typing import Annotated, List, Union

from fastapi import Depends
from sqlalchemy import UniqueConstraint
from sqlmodel import Column, Enum, Field, Relationship, Session, SQLModel, create_engine

from jdblog.config import config


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
    comments: List["Comment"] = Relationship(back_populates="owner")


class UserPublic(SQLModel):
    id: int | None
    username: str
    profile: Union["Profile", None]


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


class PostTagLink(SQLModel, table=True):
    post_id: int | None = Field(default=None, foreign_key="post.id", primary_key=True)
    tag_name: str | None = Field(default=None, foreign_key="tag.name", primary_key=True)


class Post(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    owner_id: int | None = Field(default=None, foreign_key="user.id")
    owner: User = Relationship(
        back_populates="posts",
        sa_relationship_kwargs={"lazy": "joined"},
    )
    title: str | None
    excerpt: str | None
    image: str | None
    text: str | None
    tags: list["Tag"] = Relationship(
        back_populates="posts",
        link_model=PostTagLink,
        sa_relationship_kwargs={"lazy": "joined"},
    )
    comments: list["Comment"] = Relationship(back_populates="post")
    created_date: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class PostPublic(SQLModel):
    id: int
    owner: User | None = None
    title: str | None
    excerpt: str | None
    image: str | None
    text: str | None
    tags: list["TagPublic"] = []
    created_date: datetime.datetime
    comments: list["CommentPublic"] = []


class PostShortPublic(SQLModel):
    title: str | None
    image: str | None


class Tag(SQLModel, table=True):
    name: str = Field(default=None, primary_key=True)
    posts: list[Post] = Relationship(
        back_populates="tags",
        link_model=PostTagLink,
        sa_relationship_kwargs={"lazy": "joined"},
    )
    created_date: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class TagPublic(SQLModel):
    name: str
    created_date: datetime.datetime


class TagPublicLongPost(SQLModel):
    name: str
    posts: list[PostPublic] = []


class Comment(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    post_id: int | None = Field(
        default=None,
        foreign_key="post.id",
    )
    post: Post | None = Relationship(
        back_populates="comments",
        sa_relationship_kwargs={"lazy": "joined"},
    )
    owner_id: int | None = Field(
        default=None,
        foreign_key="user.id",
    )
    owner: User | None = Relationship(
        back_populates="comments",
        sa_relationship_kwargs={"lazy": "joined"},
    )
    text: str | None
    created_date: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class CommentPublic(SQLModel):
    owner: UserPublic | None
    text: str | None
    created_date: datetime.datetime | None
    id: int | None


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
