import json

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from flask import Flask, jsonify, make_response

load_dotenv()

app = Flask(__name__)

bedrock = boto3.client('bedrock-runtime', region_name="us-east-2")

@app.route("/")
def hello_from_root():
    return jsonify(message='Hello from root!')


@app.route("/get_response")
def hello():

    # Set the model ID, e.g., Claude 3 Haiku.
    model_id = "us.anthropic.claude-3-5-haiku-20241022-v1:0"

    # Define the prompt for the model.
    prompt = "What is the capital of France?"

    # Format the request payload using the model's native structure.
    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 200,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": prompt}],
            }
        ],
    }

    # Convert payload to JSON
    payload_json = json.dumps(native_request)

    try:
        response = bedrock.invoke_model(
        modelId=model_id,
        contentType="application/json",
        accept="application/json",
        body=payload_json
    )
    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        exit(1)

    # Decode the response body.
    model_response = json.loads(response["body"].read())

    # Extract and print the response text.
    response_text = model_response["content"][0]["text"]
    return jsonify(message=response_text)


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)
