import unittest.mock
from unittest.mock import AsyncMock

from fastapi.testclient import TestClient

from jdblog import database


def test_read_main(test_client: TestClient):
    """Test root main."""
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "hello world"}


def test_get_users(user: database.UserPub, test_client: TestClient):
    """Test get list of users."""
    access_token = test_client.post(
        "/login/password",
        json={
            "username": "foobar",
            "password": "foobar",
        },
    ).json()["access_token"]

    response = test_client.get(
        "/users",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.json() == [
        {
            "id": 1,
            "profile": {
                "created_date": unittest.mock.ANY,
                "firstName": "Hello First",
                "id": 1,
                "lastName": "Last Name",
                "photo": "Photo",
                "user_id": 1,
            },
            "user_type": "member",
            "username": "foobar",
        }
    ]


def test_get_users_missing_bearer(user: database.UserPub, test_client: TestClient):
    """Test getting list of users with missing bearer."""
    response = test_client.get("/users")
    assert response.json() == {"detail": "Not authenticated"}
