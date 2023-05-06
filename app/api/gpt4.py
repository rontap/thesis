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

if (ORG is None or KEY is None):
    raise "No GRAPHENE_GPT_ORG and _KEY are added. Please create a .env-file"

async def echo(websocket, path):
    async for message in websocket:
        print(message)
        await  gpt_chat_int(message, websocket)
        await websocket.send("EOF")


async def send_messages(websocket, message_queue):
    while True:
        message = await message_queue.get()
        await websocket.send(message)


async def send_message(websocket, message):
    await websocket.send(message)


async def gpt_chat_int(prompt, websocket):
    start_time = time.time()
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {'role': 'user', 'content': prompt}
        ],
        temperature=0,
        stream=True
    )
    collected_chunks = []
    collected_messages = []

    for chunk in response:
        collected_chunks.append(chunk)
        chunk_message = chunk['choices'][0]['delta']
        collected_messages.append(chunk_message)
        if "content" in chunk_message:
            print(f'{chunk_message["content"]}', end='')
            await websocket.send(chunk_message["content"])
            await asyncio.sleep(0)
    print(f"Full response received")


def gpt_chat(prompt):
    start_time = time.time()
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {'role': 'user', 'content': prompt}
        ],
        temperature=0,
        stream=False
    )
    message = response.choices[0].message["content"].strip()
    print("!! {}", message)
    return message


async def main():
    print("Starting GPT WS Service...")
    async with websockets.serve(echo, "localhost", 8765, max_size=10 * 1024 * 1024):
        await asyncio.Future()


asyncio.run(main())
