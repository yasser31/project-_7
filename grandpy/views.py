import pdb
import requests
import speech_recognition as sr
import wikipedia
from config import KEY, SEARCH_URL
from flask import Flask, jsonify, request
from flask import render_template
from .function import parse

# flask app
app = Flask(__name__)
# app config
app.config.from_object('config')


# index view
@app.route('/index/')
def index():
    return render_template("index.html")


# seach view
@app.route('/search/')
def search(text=None):
    if text:
        query = parse(text)
    else:
        # th expression type by the user
        exp = request.args.get("query")
        # the query after being parse by function
        query = parse(exp)
    place_search_params = {
        "key": KEY,
        "input": query,
        "inputtype": "textquery",
        "fields": "formatted_address,geometry/location",

    }
    try:
        place_result = requests.get(SEARCH_URL, params=place_search_params)
        result_json = place_result.json()
        address = result_json["candidates"][0]["formatted_address"]
        location = result_json["candidates"][0]["geometry"]["location"]
    except IndexError:
        return jsonify(error=True)
    else:
        return jsonify(address=address, location=location)

# view handling wikipedia
@app.route('/wiki/')
def wiki(text=None):
    if text:
        query = parse(text)
    else:
        exp = request.args.get("query")
        query = parse(exp)
    wikipedia.set_lang("fr")
    try:
        wiki_result = wikipedia.summary(query, sentences=4)
    except:
        return jsonify(error=True)
    else:
        return jsonify(wiki=wiki_result)


@app.route('/speech/', methods=['POST'])
def speech():
    file = request.files["audio"]
    r = sr.Recognizer()
    audio_file = sr.AudioFile(file)
    with audio_file as source:
        r.adjust_for_ambient_noise(source)
        audio = r.record(source)
        text = r.recognize_google(audio, language='fr-FR')
        return jsonify(text=text)
