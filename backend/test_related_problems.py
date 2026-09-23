def create_problem(client, auth_headers, title, topic="Arrays"):
    res = client.post(
        "/problems",
        json={"title": title, "difficulty": "Easy", "topic": topic},
        headers=auth_headers,
    )
    return res.json()


def test_related_excludes_self_and_different_topic(
    client,
    auth_headers,
    db_session,
):
    from models import ProblemDB

    main_problem = create_problem(
        client,
        auth_headers,
        "Main Problem",
        topic="Arrays",
    )

    same_topic = ProblemDB(
        slug="same-topic-problem",
        title="Same Topic Problem",
        difficulty="Easy",
        topic="Arrays",
        description="Same topic test problem",
    )

    different_topic = ProblemDB(
        slug="different-topic-problem",
        title="Different Topic Problem",
        difficulty="Easy",
        topic="Graphs",
        description="Different topic test problem",
    )

    db_session.add_all([same_topic, different_topic])
    db_session.commit()

    res = client.get(
        f"/problems/{main_problem['slug']}/related",
        headers=auth_headers,
    )

    related_ids = [p["id"] for p in res.json()]

    assert main_problem["id"] not in related_ids
    assert same_topic.id in related_ids
    assert different_topic.id not in related_ids


def test_related_excludes_problems_already_in_library(client, auth_headers):
    main_problem = create_problem(
        client,
        auth_headers,
        "Main Problem 2",
        topic="Trees",
    )

    already_added = create_problem(
        client,
        auth_headers,
        "Already In Library",
        topic="Trees",
    )

    # already_added is automatically in the library
    # since creating it via POST /problems adds it

    res = client.get(
        f"/problems/{main_problem['slug']}/related",
        headers=auth_headers,
    )

    related_ids = [p["id"] for p in res.json()]

    assert already_added["id"] not in related_ids