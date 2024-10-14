import io
import json
import pickle
import random
from typing import List

import cv2 as cv
import matplotlib.pyplot as plt
import nltk
import numpy as np
import uvicorn
from fastapi import (FastAPI, File, HTTPException, UploadFile, WebSocket,
                     WebSocketDisconnect)
from nltk.stem import WordNetLemmatizer
from pydantic import BaseModel
from tensorflow.keras.models import load_model

nltk.download('punkt')

app = FastAPI()

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

# Load intents JSON file
with open("./text-model/dataset.json") as file:
    intents = json.load(file)

# Load words, classes, and model
with open("./text-model/words.pkl", "rb") as file:
    words = pickle.load(file)

with open("./text-model/classes.pkl", "rb") as file:
    classes = pickle.load(file)

chatbot_model = load_model(
    "./text-model/text_model.h5"
)  # Ensure the correct model filename

# Load image classifier model
image_model = load_model("./image-model/image_model.h5")
class_names = ["Abrasions", "Bruises", "Burns", "Cuts", "Laceration"]

# Clean up the sentences
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

# Converts the sentences into a bag of words
def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)  # bow: Bag Of Words, feed the data into the neural network
    res = chatbot_model.predict(np.array([bow]))[0]  # res: result. [0] as index 0
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
                "links": intent["links"],
            }

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: dict  # Updated to return the full response object

@app.post("/api/talk", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    ints = predict_class(request.message)
    response = get_response(ints, intents)
    return ChatResponse(response=response)

@app.post("/api/classify")
async def classify_image(file: UploadFile = File(...)):
    contents = await file.read()
    np_img = np.frombuffer(contents, np.uint8)
    image = cv.imdecode(np_img, cv.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
    image = cv.resize(image, (180, 180))
    image = np.expand_dims(image, axis=0)
    image = image / 255.0

    prediction = image_model.predict(image)
    index = np.argmax(prediction)
    return {"prediction": class_names[index]}

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
            # Receive binary image data
            data = await websocket.receive_bytes()
            np_img = np.frombuffer(data, np.uint8)
            image = cv.imdecode(np_img, cv.IMREAD_COLOR)
            if image is None:
                await websocket.send_text("Invalid image file")
                continue

            image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
            image = cv.resize(image, (180, 180))
            image = np.expand_dims(image, axis=0)
            image = image / 255.0

            prediction = image_model.predict(image)
            index = np.argmax(prediction)
            await websocket.send_text(class_names[index])
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
