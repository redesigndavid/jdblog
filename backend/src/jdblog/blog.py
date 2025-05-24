import datetime
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import func, select

from jdblog import auth, database

# Authentication router
router = APIRouter()


def get_kind(kind: str):
    return getattr(database.ArticleKind, kind)


GetKind = Annotated[database.ArticleKind, Depends(get_kind)]


@router.get("/article/{kind}", response_model=list[database.ArticlePublic])
async def get_articles(
    session: database.MakeSession,
    kind: GetKind,
    status: database.ArticleStatus | None = None,
):
    return [
        article
        for article in session.exec(
            select(
                database.Article,
            ).where(database.Article.kind == kind)
        ).unique()
    ]


@router.get("/article/{kind}/{article_id}", response_model=database.ArticlePublic)
async def get_article(article_id: int, kind: GetKind, session: database.MakeSession):
    article = session.exec(
        select(
            database.Article,
        ).where(database.Article.id == article_id, database.Article.kind == kind)
    ).first()
    return article


@router.post("/article/{kind}/new", response_model=database.Article)
async def create_article(
    article: database.Article,
    kind: GetKind,
    session: database.MakeSession,
    current_user: auth.CurrentUser,
):
    article.kind = kind
    if article.created_date is None:
        article.created_date = datetime.datetime.utcnow()
    article.owner = current_user
    session.add(article)
    session.commit()
    session.refresh(article)
    return article


@router.post("/article/{kind}/{article_id}", response_model=database.ArticlePublic)
async def update_article(
    article_id: int,
    kind: GetKind,
    session: database.MakeSession,
    article: database.Article,
):
    dbarticle = session.exec(
        select(
            database.Article,
        ).where(database.Article.id == article_id, database.Article.kind == kind)
    ).first()
    dbarticle.text = article.text
    dbarticle.title = article.title
    dbarticle.status = article.status
    session.add(dbarticle)
    session.commit()

    return dbarticle


def ensure_tag(session: database.Session, tag: database.Tag) -> database.Tag:
    dbtag = session.exec(
        select(database.Tag).where(database.Tag.name == tag.name)
    ).first()
    if dbtag is not None:
        return dbtag
    tag = database.Tag.model_validate(tag)
    session.add(tag)
    return tag


@router.post("/article/{kind}/{article_id}/tags")
async def set_article_tags(
    article_id: int,
    tags: list[str],
    kind: GetKind,
    session: database.MakeSession,
    _current_user: auth.CurrentUser,
):
    article = session.exec(
        select(database.Article).where(
            database.Article.id == article_id, database.Article.kind == kind
        )
    ).first()
    if article is None:
        return
    tags = [ensure_tag(session, database.Tag(name=tag)) for tag in tags]

    article.tags = tags
    session.commit()


@router.post("/article/{kind}/{article_id}/tag")
async def tag_article(
    article_id: int,
    tag: database.Tag,
    kind: GetKind,
    session: database.MakeSession,
    _current_user: auth.CurrentUser,
):

    article = session.exec(
        select(database.Article).where(
            database.Article.id == article_id, database.Article.kind == kind
        )
    ).first()
    if article is None:
        return

    tag = ensure_tag(session, tag)

    if tag not in article.tags:
        article.tags.append(tag)

    session.commit()


@router.post("/article/{kind}/{article_id}/untag")
async def untag_article(
    article_id: int,
    tag: database.Tag,
    kind: GetKind,
    session: database.MakeSession,
    _current_user: auth.CurrentUser,
):
    article = session.exec(
        select(database.Article).where(
            database.Article.id == article_id, database.Article.kind == kind
        )
    ).first()
    if article is None:
        return

    dbtag = session.exec(
        select(database.Tag).where(database.Tag.name == tag.name)
    ).first()
    if dbtag is None:
        return

    if tag in article.tags:
        article.tags.remove(tag)
        session.commit()


@router.post(
    "/article/{kind}/{article_id}/comment", response_model=database.CommentPublic
)
async def comment_article(
    article_id: int,
    comment: database.Comment,
    kind: GetKind,
    session: database.MakeSession,
    current_user: auth.CurrentUser,
):
    article = session.exec(
        select(database.Article).where(
            database.Article.id == article_id, database.Article.kind == kind
        )
    ).first()
    if article is None:
        return

    comment = database.Comment.model_validate(comment)
    article.comments.append(comment)
    comment.owner = current_user
    session.add(comment)
    session.commit()
    return comment


@router.get("/tag", response_model=list[database.TagPublic])
async def get_tags(session: database.MakeSession):
    tags = sorted(
        [
            tag
            for tag in session.exec(
                select(
                    database.Tag,
                )
            ).unique()
        ],
        key=lambda tag: len(tag.articles),
        reverse=True,
    )
    return tags


@router.get("/tag/{tag_name}", response_model=database.TagPublicLongArticle)
async def get_tag(session: database.MakeSession, tag_name: str):
    return session.exec(
        select(
            database.Tag,
        ).where(database.Tag.name == tag_name)
    ).first()
