import time
from http.server import HTTPServer, BaseHTTPRequestHandler

import cgi
from decouple import config
import requests

import openai
import io
import os
import subprocess
import selectors
import sys
from urllib.parse import urlparse, parse_qs

from http.server import BaseHTTPRequestHandler, HTTPServer

ORG = config('GRAPHENE_GPT_ORG')
KEY = config('GRAPHENE_GPT_KEY')

# Configure OpenAI API key
openai.organization = ORG
openai.api_key = KEY


# Define the HTTP request handler
class RequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(RequestHandler, self).end_headers()
    def do_GET(self):
        # Parse the query parameters from the URL
        url_parts = urlparse(self.path)
        query_params = parse_qs(url_parts.query)

        # Store the query parameters in a dictionary
        params_dict = {}
        for key, value in query_params.items():
            params_dict[key] = value[0]

        # Set response status code and headers
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        q = params_dict["gpt_q"]
        print()
        params_dict["gpt_res"] = gpt_chat(q)

        # Send the response
        message = '{}'.format(params_dict)
        print(message)
        self.wfile.write(bytes( params_dict["gpt_res"], "utf8"))
        return


# Create a web server and listen to incoming requests
def run():
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, RequestHandler)
    print('Starting web server...')
    httpd.serve_forever()


def gpt_chat(prompt):
    start_time = time.time()
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            #   {'role': 'system', 'content': 'You are an Canon Printer whose chip has awakened as an AI.'},
            {'role': 'user', 'content': prompt}
        ],
        temperature=0,
        stream=False
    )
    message = response.choices[0].message["content"].strip()
    print("!! {}",message)
    return message


while True:
    run()
    data = input("> prompt\n")
    if 'Exit' == data:
        break
    print(f'> read: {data}')
    gpt_chat(data)
