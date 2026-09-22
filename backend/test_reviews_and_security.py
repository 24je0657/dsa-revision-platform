def create_problem(client, auth_headers, title="Reviewable Problem"):
    res = client.post(
        "/problems",
        json={"title": title, "difficulty": "Easy", "topic": "Arrays"},
        headers=auth_headers,
    )
    return res.json()


def submit(client, auth_headers, problem_id):
    return client.post(
        "/submissions",
        json={"problem_id": problem_id, "code": "x", "language": "python"},
        headers=auth_headers,
    )


def test_reviews_due_empty_when_nothing_attempted(client, auth_headers):
    res = client.get("/reviews/due", headers=auth_headers)
    assert res.status_code == 200
    assert res.json() == []


def test_reviews_due_includes_newly_attempted_problem(client, auth_headers, monkeypatch, db_session):
    import main
    from datetime import datetime, timedelta, timezone
    from models import ProgressDB

    monkeypatch.setattr(main.random, "choice", lambda options: "Wrong Answer")

    problem = create_problem(client, auth_headers)
    submit(client, auth_headers, problem["id"])

    # force the due date into the past so it's genuinely overdue for this test
    progress = db_session.query(ProgressDB).filter(ProgressDB.problem_id == problem["id"]).first()
    progress.next_review_due = datetime.now(timezone.utc) - timedelta(days=1)
    db_session.commit()

    res = client.get("/reviews/due", headers=auth_headers)
    due_ids = [item["problem"]["id"] for item in res.json()]
    assert problem["id"] in due_ids


def test_explore_shows_in_library_flag_correctly(client, auth_headers):
    problem = create_problem(client, auth_headers, title="Explore Test Problem")

    res = client.get("/explore", headers=auth_headers)
    problems = {p["id"]: p for p in res.json()}
    assert problems[problem["id"]]["in_library"] is True


def test_explore_anonymous_shows_in_library_false(client, auth_headers):
    problem = create_problem(client, auth_headers, title="Anon Explore Test")

    res = client.get("/explore")  # no auth header at all
    assert res.status_code == 200
    problems = {p["id"]: p for p in res.json()}
    assert problems[problem["id"]]["in_library"] is False


def test_protected_endpoints_reject_missing_token(client):
    assert client.get("/problems").status_code == 401
    assert client.get("/reviews/due").status_code == 401
    assert client.get("/analytics/topics").status_code == 401
    assert client.post("/submissions", json={"problem_id": 1, "code": "x", "language": "python"}).status_code == 401