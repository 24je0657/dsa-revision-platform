def create_problem(client, auth_headers, title, topic, difficulty="Easy"):
    res = client.post(
        "/problems",
        json={"title": title, "difficulty": difficulty, "topic": topic},
        headers=auth_headers,
    )
    return res.json()


def submit(client, auth_headers, problem_id):
    return client.post(
        "/submissions",
        json={"problem_id": problem_id, "code": "x", "language": "python"},
        headers=auth_headers,
    )


def get_topic(client, auth_headers, topic_name):
    res = client.get("/analytics/topics", headers=auth_headers)
    topics = {t["topic"]: t for t in res.json()}
    return topics.get(topic_name)


def test_unattempted_topic_needs_more_practice(client, auth_headers):
    create_problem(client, auth_headers, "Solo Problem", "Tiny Topic")

    topic = get_topic(client, auth_headers, "Tiny Topic")
    assert topic["status"] == "needs_more_practice"
    assert topic["coverage"] == 0


def test_small_topic_full_coverage_accepted_is_strong(client, auth_headers, monkeypatch):
    import main
    monkeypatch.setattr(main.random, "choice", lambda options: "Accepted")

    problem = create_problem(client, auth_headers, "Only Problem", "Solo Topic")
    submit(client, auth_headers, problem["id"])

    topic = get_topic(client, auth_headers, "Solo Topic")
    assert topic["coverage"] == 100
    assert topic["status"] == "strong"


def test_small_topic_full_coverage_rejected_is_weak(client, auth_headers, monkeypatch):
    import main
    monkeypatch.setattr(main.random, "choice", lambda options: "Wrong Answer")

    problem = create_problem(client, auth_headers, "Only Problem 2", "Solo Topic 2")
    submit(client, auth_headers, problem["id"])

    topic = get_topic(client, auth_headers, "Solo Topic 2")
    assert topic["acceptance_rate"] == 0
    assert topic["status"] == "weak"


def test_large_topic_low_coverage_stays_needs_more_practice(client, auth_headers, monkeypatch):
    import main
    monkeypatch.setattr(main.random, "choice", lambda options: "Accepted")

    problems = [create_problem(client, auth_headers, f"Big Topic Problem {i}", "Big Topic") for i in range(10)]
    submit(client, auth_headers, problems[0]["id"])
    submit(client, auth_headers, problems[1]["id"])

    topic = get_topic(client, auth_headers, "Big Topic")
    assert topic["coverage"] == 20.0
    assert topic["status"] == "needs_more_practice"


def test_large_topic_qualifies_via_attempt_count_not_coverage(client, auth_headers, monkeypatch):
    import main
    monkeypatch.setattr(main.random, "choice", lambda options: "Accepted")

    problems = [create_problem(client, auth_headers, f"Huge Topic Problem {i}", "Huge Topic") for i in range(100)]
    for p in problems[:5]:
        submit(client, auth_headers, p["id"])

    topic = get_topic(client, auth_headers, "Huge Topic")
    assert topic["attempted"] == 5
    assert topic["coverage"] == 5.0
    assert topic["status"] == "strong"