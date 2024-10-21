import io
import json
import pickle
import random
from typing import List

import cv2 as cv
import nltk
import numpy as np
import uvicorn
from fastapi import (FastAPI, File, HTTPException, UploadFile, WebSocket,
                     WebSocketDisconnect)
from nltk.stem import WordNetLemmatizer
from pydantic import BaseModel
import tensorflow.keras.models as tf_models  # Explicit TensorFlow model import
from PIL import Image
from fastai.vision.all import *

nltk.download('all')

# nltk.download('punkt')
# nltk.download('punkt_tab')
# nltk.download('wordnet')

app = FastAPI()

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

# Load intents JSON file
with open("../models/astra/dataset.json") as file:
    intents = json.load(file)

# Load words, classes, and model (using TensorFlow for the chatbot)
with open("../models/astra/words.pkl", "rb") as file:
    words = pickle.load(file)

with open("../models/astra/classes.pkl", "rb") as file:
    classes = pickle.load(file)

# Load the TensorFlow chatbot model explicitly
chatbot_model = tf_models.load_model("../models/astra/astra.h5")

# Load the image classifier model using FastAI
image_model = load_learner("../models/vesper/vesper.pkl")
class_names = image_model.dls.vocab  # Get the class names from the model's data

# Text model functions
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = chatbot_model.predict(np.array([bow]))[0]  # Using TensorFlow's model here
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def get_response(intents_list, intents_json):
    tag = intents_list[0]["intent"]
    for intent in intents_json["intents"]:
        if intent["tag"] == tag:
            return {
                "meaning": intent["meaning"],
                "procedures": intent["procedures"],
                "relations": intent["relations"],
                "references": intent["references"],
            }

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: dict

@app.post("/api/talk", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    ints = predict_class(request.message)
    response = get_response(ints, intents)
    return ChatResponse(response=response)

# Image classification functions
def predict_image(image):
    """Predict the class of an image using the FastAI model."""
    pred, pred_idx, probs = image_model.predict(image)  # Using FastAI model here
    return pred, probs[pred_idx].item()

@app.post("/api/classify")
async def classify_image(file: UploadFile = File(...)):
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    image = cv.imdecode(np_img, cv.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # Convert to PIL format for FastAI
    image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image)

    # Use FastAI's predict method
    prediction, confidence = predict_image(pil_image)

    return {"prediction": prediction, "confidence": confidence}

@app.websocket("/api/ws/talk")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            ints = predict_class(data)
            response = get_response(ints, intents)
            await websocket.send_text(json.dumps(response))
    except WebSocketDisconnect:
        print("Client disconnected")

@app.websocket("/api/ws/classify")
async def websocket_classify_image(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()
            np_img = np.frombuffer(data, np.uint8)
            image = cv.imdecode(np_img, cv.IMREAD_COLOR)
            if image is None:
                await websocket.send_text("Invalid image file")
                continue

            # Convert to PIL format for FastAI
            image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
            pil_image = Image.fromarray(image)

            # Predict using FastAI model
            prediction, confidence = predict_image(pil_image)
            await websocket.send_text(f"{prediction} with confidence {confidence:.4f}")
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
