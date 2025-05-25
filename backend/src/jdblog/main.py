from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import func, or_, select
from starlette.middleware.sessions import SessionMiddleware

from jdblog import auth, blog, database

MakeSession = Annotated[
    database.Session,
    Depends(database.make_session_context),
]


@asynccontextmanager
async def lifespan(app: FastAPI):  # pragma: no cover
    # Do initialization here.
    database.create_db_and_tables()
    yield
    # Do breakdown here.
    pass


app = FastAPI(lifespan=lifespan)
app.include_router(auth.router, tags=["Authentication"])
app.include_router(blog.router, tags=["Blog"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key="!secret")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return {"message": "hello world"}


@app.get("/users/me")
async def get_me_user(user: auth.CurrentUser):
    """Get all the users."""
    return user


@app.get("/user/{user_id}", response_model=database.UserPub)
def get_user(user_id: int, session: MakeSession):
    return session.exec(
        select(database.User).where(
            database.User.id == user_id,
        )
    ).one()


@app.get("/users", response_model=list[database.UserPub])
async def get_users(
    session: MakeSession,
    credentials=auth.AuthenticatedBearer,
):
    """Get all the users."""
    return [
        user
        for user in session.exec(
            select(
                database.User,
            )
        )
    ]


@app.post("/visit", response_model=database.Visit)
def visit_path(session: MakeSession, visit: database.Visit):
    session.add(visit)
    session.commit()
    return visit


@app.post("/visit/count")
def get_visit_count(session: MakeSession, url: str):
    return session.exec(
        select(func.count(database.Visit.id)).where(
            or_(database.Visit.url == url, database.Visit.url == (url + "/"))
        )
    ).one()
