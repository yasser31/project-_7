import requests
import pdb
import wikipedia
from config import KEY, SEARCH_URL
from flask import Flask, jsonify, request
from flask import render_template
from .function import parse


app = Flask(__name__)
app.config.from_object('config')


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/search/')
def search():
    exp = request.args.get("query")
    query = parse(exp)
    print(query)
    place_search_params = {
        "key": KEY,
        "input": query,
        "inputtype": "textquery",
        "fields": "formatted_address,geometry/location"
    }
    try:
        place_result = requests.get(SEARCH_URL, params=place_search_params)
        result_json = place_result.json()
        address = result_json["candidates"][0]["formatted_address"]
        location = result_json["candidates"][0]["geometry"]["location"]
    except IndexError:
        error = True
        return jsonify(error)
    else:
        return jsonify(address=address, location=location)


@app.route('/wiki/')
def wiki():
    exp = request.args.get("query")
    query = parse(exp)
    wikipedia.set_lang("fr")
    try:
        wiki_result = wikipedia.summary(query, sentences=4)
    except PageError:
        return jsonify(error=True)
    else:
        return jsonify(wiki=wiki_result)
