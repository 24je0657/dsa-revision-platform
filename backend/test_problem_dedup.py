def test_duplicate_title_reuses_existing_problem(client, auth_headers):
    first = client.post(
        "/problems",
        json={
            "title": "Same Title",
            "difficulty": "Easy",
            "topic": "Arrays",
        },
        headers=auth_headers,
    ).json()

    second = client.post(
        "/problems",
        json={
            "title": "Same Title",
            "difficulty": "Easy",
            "topic": "Arrays",
        },
        headers=auth_headers,
    ).json()

    assert first["id"] == second["id"]


def test_same_leetcode_url_reuses_existing_problem_even_with_different_title(
    client,
    auth_headers,
):
    url = "https://leetcode.com/problems/two-sum/"

    first = client.post(
        "/problems",
        json={
            "title": "Two Sum",
            "difficulty": "Easy",
            "topic": "Arrays",
            "leetcode_url": url,
        },
        headers=auth_headers,
    ).json()

    second = client.post(
        "/problems",
        json={
            "title": "2Sum (renamed)",
            "difficulty": "Easy",
            "topic": "Arrays",
            "leetcode_url": url,
        },
        headers=auth_headers,
    ).json()

    assert first["id"] == second["id"]


def test_different_titles_create_distinct_problems(
    client,
    auth_headers,
):
    first = client.post(
        "/problems",
        json={
            "title": "Problem A",
            "difficulty": "Easy",
            "topic": "Arrays",
        },
        headers=auth_headers,
    ).json()

    second = client.post(
        "/problems",
        json={
            "title": "Problem B",
            "difficulty": "Easy",
            "topic": "Arrays",
        },
        headers=auth_headers,
    ).json()

    assert first["id"] != second["id"]


def test_adding_same_problem_twice_does_not_duplicate_library_entry(
    client,
    auth_headers,
):
    client.post(
        "/problems",
        json={
            "title": "Repeat Add",
            "difficulty": "Easy",
            "topic": "Arrays",
        },
        headers=auth_headers,
    )

    client.post(
        "/problems",
        json={
            "title": "Repeat Add",
            "difficulty": "Easy",
            "topic": "Arrays",
        },
        headers=auth_headers,
    )

    res = client.get(
        "/problems",
        headers=auth_headers,
    )

    titles = [p["title"] for p in res.json()]

    assert titles.count("Repeat Add") == 1