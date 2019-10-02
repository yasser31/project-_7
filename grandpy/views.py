import requests
import wikipedia
from config import KEY
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
    search_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    exp = request.args.get("query")
    query = parse(exp)
    place_search_params = {
        "key": KEY,
        "input": query,
        "inputtype": "textquery",
        "fields": "formatted_address,geometry/location"
    }
    place_result = requests.get(search_url, params=place_search_params)
    result = place_result.json()
    address = result["candidates"][0]["formatted_address"]
    location = result["candidates"][0]["geometry"]["location"]
    return jsonify(address=address, location=location)


@app.route('/wiki/')
def wiki():
    exp = request.args.get("query")
    query = parse(exp)
    print(query)
    wikipedia.set_lang("fr")
    wiki_result = wikipedia.summary(query, sentences=4)
    return jsonify(wiki=wiki_result)
