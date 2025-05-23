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


class UserType(str, enum.Enum):
    member = "member"
    admin = "admin"


class UserPub(SQLModel):  # type: ignore
    id: Union[int, None] = Field(default=None, primary_key=True)
    username: str
    profile: Union["Profile", None]
    user_type: UserType


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

    articles: List["Article"] = Relationship(back_populates="owner")
    comments: List["Comment"] = Relationship(back_populates="owner")
    user_type: UserType = Field(
        default=UserType.member, sa_column=Column(Enum(UserType))
    )


class UserPublic(SQLModel):
    id: int | None
    username: str
    profile: Union["Profile", None]
    user_type: UserType


class AuthProvider(str, enum.Enum):
    password = "password"
    google = "google"
    github = "github"


class ArticleKind(str, enum.Enum):
    post = "post"
    page = "page"


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
    id: Union[int, None] = Field(default=None, primary_key=True)
    username: str
    access_token: str
    refresh_token: str
    status: bool
    created_date: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class ArticleTagLink(SQLModel, table=True):
    article_id: int | None = Field(
        default=None, foreign_key="article.id", primary_key=True
    )
    tag_name: str | None = Field(default=None, foreign_key="tag.name", primary_key=True)


class Article(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    owner_id: int | None = Field(default=None, foreign_key="user.id")
    owner: User = Relationship(
        back_populates="articles",
        sa_relationship_kwargs={"lazy": "joined"},
    )
    kind: ArticleKind = Field(sa_column=Column(Enum(ArticleKind)))
    title: str | None
    excerpt: str | None
    image: str | None
    text: str | None
    tags: list["Tag"] = Relationship(
        back_populates="articles",
        link_model=ArticleTagLink,
        sa_relationship_kwargs={"lazy": "joined"},
    )
    comments: list["Comment"] = Relationship(back_populates="article")
    created_date: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )
    visits: list["Visit"] = Relationship(back_populates="article")


class ArticlePublic(SQLModel):
    id: int
    owner: User | None = None
    title: str | None
    excerpt: str | None
    image: str | None
    text: str | None
    tags: list["TagPublic"] = []
    created_date: datetime.datetime
    comments: list["CommentPublic"] = []
    visits: list["VisitPublic"] = []


class ArticleShortPublic(SQLModel):
    title: str | None
    image: str | None


class Tag(SQLModel, table=True):
    name: str = Field(default=None, primary_key=True)
    articles: list[Article] = Relationship(
        back_populates="tags",
        link_model=ArticleTagLink,
        sa_relationship_kwargs={"lazy": "joined"},
    )
    created_date: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )


class TagPublic(SQLModel):
    name: str
    created_date: datetime.datetime


class TagPublicLongArticle(SQLModel):
    name: str
    articles: list[ArticlePublic] = []


class Comment(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    article_id: int | None = Field(
        default=None,
        foreign_key="article.id",
    )
    article: Article | None = Relationship(
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


class Visit(SQLModel, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    path: str | None
    url: str
    referrer: str | None
    article_type: str | None
    created_date: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )
    article_id: int | None = Field(default=None, foreign_key="article.id")
    article: Article | None = Relationship(
        back_populates="visits",
        sa_relationship_kwargs={"lazy": "joined"},
    )


class VisitPublic(SQLModel):
    created_date: datetime.datetime | None
    path: str


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
