from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from jdblog import auth, database
from jdblog.main import app
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool


@pytest.fixture(name="session")
def session_fixture():
    """Create a session fixture using an sqline database."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="oauth")
def oauth():
    """Create an oauth async mock."""
    return AsyncMock()


@pytest.fixture(name="test_client")
def client_fixture(session: Session, oauth: AsyncMock):
    """Create a test client fixture."""

    def get_session_override():
        return session

    app.dependency_overrides[database.make_session_context] = get_session_override
    app.dependency_overrides[auth.make_oauth] = lambda: oauth

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="user")
def user_fixture(test_client: TestClient):
    """Create a user fixture."""

    test_client.post(
        "/register/password",
        json={
            "username": "foobar",
            "password": "foobar",
            "firstName": "Hello First",
            "lastName": "Last Name",
            "photo": "Photo",
        },
    ).json()

    return database.UserPub(**test_client.get("/user/1").json())
