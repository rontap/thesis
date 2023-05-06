import time
from http.server import HTTPServer, BaseHTTPRequestHandler

import cgi
from decouple import config
import requests
import asyncio
import websockets
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

#
# # Define the HTTP request handler
# class RequestHandler(BaseHTTPRequestHandler):
#     def end_headers(self):
#         self.send_header('Access-Control-Allow-Origin', '*')
#         self.send_header('Access-Control-Allow-Methods', 'GET')
#         self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
#         return super(RequestHandler, self).end_headers()
#     def do_GET(self):
#         # Parse the query parameters from the URL
#         url_parts = urlparse(self.path)
#         query_params = parse_qs(url_parts.query)
#
#         # Store the query parameters in a dictionary
#         params_dict = {}
#         for key, value in query_params.items():
#             params_dict[key] = value[0]
#
#         # Set response status code and headers
#         self.send_response(200)
#         self.send_header('Content-type', 'text/html')
#         self.end_headers()
#
#         q = params_dict["gpt_q"]
#         print()
#         params_dict["gpt_res"] = gpt_chat(q)
#
#         # Send the response
#         message = '{}'.format(params_dict)
#         print(message)
#         self.wfile.write(bytes( params_dict["gpt_res"], "utf8"))
#         return
#
#
# # Create a web server and listen to incoming requests
# def run():
#     server_address = ('', 8080)
#     httpd = HTTPServer(server_address, RequestHandler)
#     print('Starting web server...')
#     httpd.serve_forever()



async def echo(websocket, path):
    async for message in websocket:
        print(message)
        await  gpt_chat_int(message,websocket)
        await websocket.send("EOF")

async def send_messages(websocket, message_queue):
    while True:
        message = await message_queue.get()
        await websocket.send(message)
async def send_message(websocket, message):
    await websocket.send(message)
async def gpt_chat_int(prompt,websocket):
    start_time = time.time()
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[

            {'role': 'user', 'content': prompt}
        ],
        temperature=0,
        stream=True  # again, we set stream=True
    )
    collected_chunks = []
    collected_messages = []



    # iterate through the stream of events
    for chunk in response:
        chunk_time = time.time() - start_time  # calculate the time delay of the chunk
        collected_chunks.append(chunk)  # save the event response
        chunk_message = chunk['choices'][0]['delta']  # extract the message
        collected_messages.append(chunk_message)  # save the message
        if "content" in chunk_message:
            print(f'{chunk_message["content"]}', end='')
            await websocket.send(chunk_message["content"])
            await asyncio.sleep(0)

    # print the time delay and text received
    print('\n')

    print(f"Full response received {chunk_time:.2f} seconds after request")


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



async def xsend_message(websocket, message):
    await websocket.send(message)

async def xsend_messages(websocket, messages):
    tasks = [asyncio.create_task(xsend_message(websocket, message)) for message in messages]
    try:
        for task in tasks:
            await asyncio.sleep(0.01)
            await task
            await asyncio.sleep(0.01)
    except Exception as e:
        print(f"Error sending messages: {e}")
async def xecho(websocket, path):
    messages = [chr(i + ord('a')) for i in range(10)]
    asyncio.create_task(xsend_messages(websocket, messages))
async def main():
    async with websockets.serve(echo, "localhost", 8765, max_size=10*1024*1024):
        await asyncio.Future()
# data = input("> prompt\n")
#     if 'Exit' == data:
#         break
#     print(f'> read: {data}')
#     gpt_chat(data)

asyncio.run(main())
