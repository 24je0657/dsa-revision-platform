def test_signup_creates_user(client):
    res = client.post(
        "/signup",
        json={
            "email": "alice@example.com",
            "password": "secret123",
        },
    )

    assert res.status_code == 200

    data = res.json()

    assert data["email"] == "alice@example.com"
    assert "hashed_password" not in data


def test_signup_duplicate_email_fails(client):
    client.post(
        "/signup",
        json={
            "email": "bob@example.com",
            "password": "secret123",
        },
    )

    res = client.post(
        "/signup",
        json={
            "email": "bob@example.com",
            "password": "different",
        },
    )

    assert res.status_code == 400


def test_login_correct_credentials(client):
    client.post(
        "/signup",
        json={
            "email": "carol@example.com",
            "password": "secret123",
        },
    )

    res = client.post(
        "/login",
        json={
            "email": "carol@example.com",
            "password": "secret123",
        },
    )

    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password_fails(client):
    client.post(
        "/signup",
        json={
            "email": "dave@example.com",
            "password": "secret123",
        },
    )

    res = client.post(
        "/login",
        json={
            "email": "dave@example.com",
            "password": "wrongpass",
        },
    )

    assert res.status_code == 401


def test_login_nonexistent_user_fails(client):
    res = client.post(
        "/login",
        json={
            "email": "nobody@example.com",
            "password": "whatever",
        },
    )

    assert res.status_code == 401