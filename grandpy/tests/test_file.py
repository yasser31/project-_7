from selenium import webdriver
import speech_recognition as sr
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import pytest
import requests
from grandpy.views import search, app, index, wiki


class MockResponse():

    '''define a json response and change the get response'''

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

# json response test


def test_json_response(monkeypatch):

    def mock_return(*args, **kwargs):
        return MockResponse()

    with app.test_request_context() as req:
        req.request.args = {"query": "query"}
        monkeypatch.setattr(requests, "get", mock_return)
        result = search().get_json()

    assert result['address'] == 'some address'
    assert result['location'] == "some location"

# get index page test


def test_index():
    test_client = app.test_client()
    test = test_client.get('/index/')
    assert test.status_code == 200

# test place search errors


def test_search_errors():
    with app.test_request_context() as req:
        req.request.args = {"query": "fsfdsfs"}
        result = search().get_json()
        assert result["error"] is True

# test wiki search errors


def test_wiki_errors():
    with app.test_request_context() as req:
        req.request.args = {"query": "ffsdfsdfds"}
        result = wiki().get_json()
        assert result["error"] is True


def test_selenium():
    driver = webdriver.Firefox()
    driver.get("http://127.0.0.1:5000/index/")
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "speech"))
    )
    element.click()


def test_speech():
    r = sr.Recognizer()
    audio_file = sr.AudioFile("openclassrooms.wav")
    with audio_file as source:
        audio = r.record(source)
        text = r.recognize_google(audio, language='fr-FR')
    assert text == "openclassroom"
