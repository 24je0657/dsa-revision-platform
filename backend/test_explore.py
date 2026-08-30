def test_explore_public(client):
    response = client.get("/explore")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)