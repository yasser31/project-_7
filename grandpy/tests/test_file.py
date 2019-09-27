import requests
from grandpy.views import search, app, index


class MockResponse():

    @staticmethod
    def json():
        return {
            "response": "yes"
        }

def test_json_response(monkeypatch):
    
    def mock_return(*args, **kwargs):
        return MockResponse()
    
    with app.test_request_context():
        monkeypatch.setattr(requests, "get", mock_return)
        result = search()
        
    assert result['response'] == 'yes'

def test_index():
    test_client = app.test_client()
    test = test_client.get('/')
    assert test.status_code == 200
