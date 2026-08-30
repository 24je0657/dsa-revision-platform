from models import ProgressDB


def create_problem(client, auth_headers, title="Two Sum"):
    res = client.post(
        "/problems",
        json={
            "title": title,
            "difficulty": "Easy",
            "topic": "Arrays",
        },
        headers=auth_headers,
    )

    return res.json()


def submit(client, auth_headers, problem_id):
    return client.post(
        "/submissions",
        json={
            "problem_id": problem_id,
            "code": "x",
            "language": "python",
        },
        headers=auth_headers,
    )


def test_first_submission_creates_progress_with_interval_one(
    client,
    auth_headers,
    db_session,
):
    problem = create_problem(client, auth_headers)

    submit(
        client,
        auth_headers,
        problem["id"],
    )

    progress = (
        db_session.query(ProgressDB)
        .filter(
            ProgressDB.problem_id == problem["id"]
        )
        .first()
    )

    assert progress is not None
    assert progress.interval_days == 1


def test_accepted_submission_doubles_interval(
    client,
    auth_headers,
    db_session,
    monkeypatch,
):
    import main

    monkeypatch.setattr(
        main.random,
        "choice",
        lambda options: "Accepted",
    )

    problem = create_problem(client, auth_headers)

    submit(
        client,
        auth_headers,
        problem["id"],
    )

    submit(
        client,
        auth_headers,
        problem["id"],
    )

    progress = (
        db_session.query(ProgressDB)
        .filter(
            ProgressDB.problem_id == problem["id"]
        )
        .first()
    )

    assert progress.interval_days == 2


def test_wrong_answer_resets_interval_to_one(
    client,
    auth_headers,
    db_session,
    monkeypatch,
):
    import main

    call_count = {"n": 0}

    def fake_choice(options):
        call_count["n"] += 1

        return (
            "Accepted"
            if call_count["n"] == 1
            else "Wrong Answer"
        )

    monkeypatch.setattr(
        main.random,
        "choice",
        fake_choice,
    )

    problem = create_problem(client, auth_headers)

    submit(
        client,
        auth_headers,
        problem["id"],
    )  # Accepted → interval becomes 2

    submit(
        client,
        auth_headers,
        problem["id"],
    )  # Wrong Answer → resets to 1

    progress = (
        db_session.query(ProgressDB)
        .filter(
            ProgressDB.problem_id == problem["id"]
        )
        .first()
    )

    assert progress.interval_days == 1