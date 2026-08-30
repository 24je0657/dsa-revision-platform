import os

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from database import Base, get_db
from main import app

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

if not TEST_DATABASE_URL:
    DB_PASSWORD = os.environ["DB_PASSWORD"]
    TEST_DATABASE_URL = f"postgresql://postgres:{DB_PASSWORD}@localhost:5433/dsa_platform_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client):
    client.post(
        "/signup",
        json={
            "email": "test@example.com",
            "password": "testpass123",
        },
    )

    res = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "password": "testpass123",
        },
    )

    token = res.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }