import requests
from grandpy.views import search, app, index


class MockResponse():

    @staticmethod
    def json():
        return {
            "candidates": [
                {
                    "formatted_address": "some address",
                    "geometry": {
                        "location": "some location"
                    }
                }
            ]
        }


def test_json_response(monkeypatch):

    def mock_return(*args, **kwargs):
        return MockResponse()

    with app.test_request_context() as req:
        req.request.args = {"query": "query"}
        monkeypatch.setattr(requests, "get", mock_return)
        result = search().get_json()

    assert result['address'] == 'some address'
    assert result['location'] == "some location"


def test_index():
    test_client = app.test_client()
    test = test_client.get('/')
    assert test.status_code == 200
