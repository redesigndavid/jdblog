from fastapi import APIRouter
from sqlmodel import select

from jdblog import auth, database

# Authentication router
router = APIRouter()


@router.get("/post", response_model=list[database.PostPublic])
async def get_posts(session: database.MakeSession):
    return [
        post
        for post in session.exec(
            select(
                database.Post,
            )
        ).unique()
    ]


@router.get("/post/{post_id}", response_model=database.PostPublic)
async def get_post(post_id: int, session: database.MakeSession):
    post = session.exec(
        select(
            database.Post,
        ).where(database.Post.id == post_id)
    ).first()
    return post


@router.post("/post/new", response_model=database.Post)
async def create_post(
    post: database.Post,
    session: database.MakeSession,
    current_user: auth.CurrentUser,
):
    post = database.Post.model_validate(post)
    post.owner = current_user
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@router.post("/post/{post_id}/tag")
async def tag_post(
    post_id: int,
    tag: database.Tag,
    session: database.MakeSession,
    _current_user: auth.CurrentUser,
):

    need_commit = False
    post = session.exec(
        select(database.Post).where(database.Post.id == post_id)
    ).first()
    if post is None:
        return

    dbtag = session.exec(
        select(database.Tag).where(database.Tag.name == tag.name)
    ).first()
    if dbtag is None:
        tag = database.Tag.model_validate(tag)
        session.add(tag)
        need_commit = True
    else:
        tag = dbtag

    if tag not in post.tags:
        post.tags.append(tag)
        need_commit = True

    if need_commit:
        session.commit()


@router.post("/post/{post_id}/untag")
async def untag_post(
    post_id: int,
    tag: database.Tag,
    session: database.MakeSession,
    _current_user: auth.CurrentUser,
):

    post = session.exec(
        select(database.Post).where(database.Post.id == post_id)
    ).first()
    if post is None:
        return

    dbtag = session.exec(
        select(database.Tag).where(database.Tag.name == tag.name)
    ).first()
    if dbtag is None:
        return

    if tag in post.tags:
        post.tags.remove(tag)
        session.commit()


@router.post("/post/{post_id}/comment", response_model=database.CommentPublic)
async def comment_post(
    post_id: int,
    comment: database.Comment,
    session: database.MakeSession,
    current_user: auth.CurrentUser,
):
    post = session.exec(
        select(database.Post).where(database.Post.id == post_id)
    ).first()
    if post is None:
        return

    comment = database.Comment.model_validate(comment)
    post.comments.append(comment)
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
        key=lambda tag: len(tag.posts),
        reverse=True,
    )
    return tags


@router.get("/tag/{tag_name}", response_model=database.TagPublicLongPost)
async def get_tag(session: database.MakeSession, tag_name: str):
    return session.exec(
        select(
            database.Tag,
        ).where(database.Tag.name == tag_name)
    ).first()
