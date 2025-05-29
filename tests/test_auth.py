import unittest.mock
from typing import Callable
from unittest.mock import Mock

import pytest
import requests
from asyncmock import AsyncMock
from fastapi.testclient import TestClient
from sqlmodel import Session, select

from jdblog import auth, database


@pytest.fixture
def fake_google_token():
    return {
        "userinfo": {
            "email": "email",
            "given_name": "given_name",
            "family_name": "family_name",
            "picture": "picture",
        }
    }


def test_register(test_client: TestClient):
    response = test_client.post(
        "/register/password",
        json={
            "username": "foobar",
            "password": "foobar",
            "firstName": "Hello First",
            "lastName": "Last Name",
            "photo": "photo",
        },
    )
    assert response.status_code == 200
    assert response.json() == {"message": "user created successfully"}


def test_login(test_client: TestClient):
    test_client.post(
        "/register/password",
        json={
            "username": "foobar",
            "password": "foobar",
            "firstName": "Hello First",
            "lastName": "Last Name",
            "photo": "photo",
        },
    )
    response = test_client.post(
        "/login/password",
        json={
            "username": "foobar",
            "password": "foobar",
        },
    )

    assert list(sorted(response.json().keys())) == list(
        sorted(
            [
                "username",
                "refresh_token",
                "id",
                "created_date",
                "access_token",
                "status",
            ]
        )
    )


def test_login_failed(test_client: TestClient):

    response = test_client.post(
        "/login/password",
        json={
            "username": "foobar",
            "password": "foobar",
        },
    )

    assert list(sorted(response.json().keys())) == ["error"]


def test_login_wrong_password(test_client: TestClient):
    test_client.post(
        "/register/password",
        json={
            "username": "foobar",
            "password": "foobar",
            "firstName": "Hello First",
            "lastName": "Last Name",
            "photo": "photo",
        },
    )
    response = test_client.post(
        "/login/password",
        json={
            "username": "foobar",
            "password": "wrong",
        },
    )

    assert response.json() == {"error": "Incorrect password"}


def test_double_login(test_client: TestClient):
    test_client.post(
        "/register/password",
        json={
            "username": "foobar",
            "password": "foobar",
            "firstName": "Hello First",
            "lastName": "Last Name",
            "photo": "Last Name",
        },
    )
    test_client.post(
        "/login/password",
        json={
            "username": "foobar",
            "password": "foobar",
        },
    )
    response = test_client.post(
        "/login/password",
        json={
            "username": "foobar",
            "password": "foobar",
        },
    )

    assert list(sorted(response.json().keys())) == list(
        sorted(
            [
                "username",
                "refresh_token",
                "id",
                "created_date",
                "access_token",
                "status",
            ]
        )
    )


def test_auth_google_user_creator(fake_google_token: dict, session: Session):
    user, auth_identity = auth.auth_google_user_creator(session, fake_google_token)
    assert user.username == fake_google_token["userinfo"]["email"]
    assert auth_identity in user.auth_identity
    assert auth_identity.provider_user_id == fake_google_token["userinfo"]["email"]
    assert auth_identity.provider == database.AuthProvider.google
    assert user.profile.firstName == fake_google_token["userinfo"]["given_name"]
    assert user.profile.lastName == fake_google_token["userinfo"]["family_name"]
    assert user.profile.photo == fake_google_token["userinfo"]["picture"]


def test_auth_google_user_creator_bad(fake_google_token: dict, session: Session):
    fake_google_token.pop("userinfo")
    with pytest.raises(KeyError):
        auth.auth_google_user_creator(session, fake_google_token)


def test_auth_github_user_creator(mocker, session: Session):
    mocked = mocker.Mock()
    mocked_get = mocker.patch.object(requests, "get")

    def _mock_get(url, headers):
        if url == "https://api.github.com/user/emails":
            mocked.json.return_value = [{"email": "hello@hello.com", "primary": True}]
        if url == "https://api.github.com/user":
            mocked.json.return_value = {"name": "Name", "avatar_url": "avatarurl"}
        return mocked

    mocked_get.side_effect = _mock_get

    user, auth_identity = auth.auth_github_user_creator(
        session, {"access_token": "footoken"}
    )
    assert user.username == "hello@hello.com"
    assert auth_identity.provider_user_id == "hello@hello.com"
    assert auth_identity.provider == database.AuthProvider.github
    assert auth_identity in user.auth_identity
    assert user.profile.firstName == "Name"
    assert user.profile.lastName == ""
    assert user.profile.photo == "avatarurl"


@pytest.mark.parametrize(
    "provider, user_creator",
    [
        ("google", auth.auth_google_user_creator),
        ("github", auth.auth_github_user_creator),
    ],
)
def test_get_user_creator(provider: str, user_creator: Callable):
    """Test get user creator."""
    assert auth.get_user_creator(provider) is user_creator


def test_add_params():
    """Test add params."""
    assert (
        auth.add_params("http://hello/world", {"foo": "bar"})
        == "http://hello/world?foo=bar"
    )


def test_auth_google(test_client: TestClient, oauth: Mock, session: Session):
    """Test authentication with google."""
    oauth.google.authorize_access_token.return_value = {
        "userinfo": {
            "email": "email@helloworld.com",
            "given_name": "given_name",
            "family_name": "family_name",
            "picture": "picture",
        }
    }
    response = test_client.get("/auth/google", follow_redirects=False)

    user = session.exec(
        select(database.User).where(
            database.User.username == "email@helloworld.com",
        )
    ).first()
    assert user.username == "email@helloworld.com"
    assert user.auth_identity[0].provider_user_id == "email@helloworld.com"
    assert user.auth_identity[0].provider == database.AuthProvider.google
    assert user.profile.firstName == "given_name"
    assert user.profile.lastName == "family_name"
    assert response.status_code == 307


def test_login_google(test_client: TestClient, oauth: AsyncMock):
    """Test login with google."""
    oauth.google.authorize_redirect.return_value = "foo"
    test_client.get("/login/google").json() == "foo"
