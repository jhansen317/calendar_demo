"""
 This exists mainly as a way of getting around the same-origin policy for ajax requests,
 and to handle some of the request building tasks we don't want to do in the browser.

 Requests are forwarded along with any data and auth headers to the remote endpoints,
 responses are returned unchanged.
"""

from flask import Flask, request, g
import os
import json
import logging
from datetime import date, datetime
import time
import requests

logging.basicConfig(level=logging.DEBUG)
LOGGER = logging.getLogger(__name__)

def do_proxy_request(method, url, **kwargs):
    try:
        r = requests.request(method, url, **kwargs)
        r.raise_for_status()
    except Exception as e:
        LOGGER.error("HTTP error %s - %s: %s", method, url, e)
        return None
    else:
        return r

app = Flask(__name__)
app.config.from_json('config.json')

@app.route("/events_proxy", methods=['GET', 'POST', 'PUT'])
def events_proxy():
    post_data = request.get_json(force=True, silent=True) # force and silent ensure post_data will be None if not valid json, the default.
    r = do_proxy_request(request.method, app.config['REMOTE_API_URL'], headers={'api_key' : app.config['REMOTE_API_KEY']}, json=post_data)

    if r is not None:
        return (r.text, r.status_code)
    else:
        return ('{}', 500, {'Content-type': 'application/json'})

@app.route('/events_proxy/<eid>', methods=['GET', 'DELETE'])
def events_proxy_id(eid):
    r = do_proxy_request(request.method, '%s/%s' % (app.config['REMOTE_API_URL'], eid), headers={'api_key' : app.config['REMOTE_API_KEY']})

    if r is not None:
        return (r.text, r.status_code)
    else:
        return ('{}', 500, {'Content-type': 'application/json'})
