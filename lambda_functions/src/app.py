import json

import boto3
from flask import Flask, jsonify, make_response

app = Flask(__name__)

bedrock = boto3.client('bedrock-runtime', region_name="us-east-2")

@app.route("/")
def hello_from_root():
    return jsonify(message='Hello from root!')


@app.route("/get_response")
def hello():

    # Define the prompt
    prompt = "What is the capital of France?"

    # Set up request payload (using Anthropic Claude)
    payload = {
        "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
        "max_tokens_to_sample": 200,
        "temperature": 0.5,
        "top_k": 250,
        "top_p": 1.0,
        "stop_sequences": ["\n\nHuman:"]
    }

    # Convert payload to JSON
    payload_json = json.dumps(payload)

    # Call Bedrock model
    response = bedrock.invoke_model(
        modelId="deepseek.r1-v1:0",
        contentType="application/json",
        accept="application/json",
        body=payload_json
    )

    # Parse response
    response_body = json.loads(response['body'].read())
    print(response_body['completion'])


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)
