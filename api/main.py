import io
import json
import pickle
import random
from typing import List

import cv2 as cv
import nltk
import numpy as np
import tensorflow.keras.models as tf_models  # Explicit TensorFlow model import
import uvicorn
from fastai.vision.all import *
from fastapi import (
    FastAPI,
    File,
    HTTPException,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from nltk.stem import WordNetLemmatizer
from PIL import Image
from pydantic import BaseModel

# nltk.download('all')
# nltk.download('punkt')
# nltk.download('punkt_tab')
# nltk.download('wordnet')

app = FastAPI()

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

CONFIDENCE_THRESHOLD = 0.8

# Load intents JSON file
with open("../models/astra-v3/dataset.json") as file:
    intents = json.load(file)

# Load words, classes, and model (using TensorFlow for the chatbot)
with open("../models/astra-v3/words.pkl", "rb") as file:
    words = pickle.load(file)

with open("../models/astra-v3/classes.pkl", "rb") as file:
    classes = pickle.load(file)

# Load the TensorFlow chatbot model explicitly
chatbot_model = tf_models.load_model("../models/astra-v3/astra.h5")

# Load the image classifier model using FastAI
image_model = load_learner("../models/vesper-v2/vesper-v2.pkl")
class_names = image_model.dls.vocab  # Get the class names from the model's data

# Text model functions
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence, model, threshold=0.7):
    bow = bag_of_words(sentence, words)
    res = model.predict(np.array([bow]))[0]
    results = [{"intent": classes[i], "probability": prob} for i, prob in enumerate(res)]
    
    # Filter predictions based on threshold
    results = [result for result in results if result["probability"] > threshold]
    results.sort(key=lambda x: x["probability"], reverse=True)
    
    # If no results meet the threshold, return "unknown"
    if not results:
        return [{"intent": "unknown", "probability": 1.0}]
    return results
        
def get_response(intents_list, intents_json):
    tag = intents_list[0]["intent"]
    if tag == "unknown":
        # Returning a dictionary even when the intent is unknown
        return {
            "meaning": "I'm sorry, but I didn't quite catch that. Could you please provide more details or rephrase your question? I'm here to help!",
            "procedures": None,
            "relations": None,
            "references": None,
        }
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
    intents_list = predict_class(request.message, chatbot_model)
    response = get_response(intents_list, intents)  # Pass the original JSON-loaded `intents` dict here
    return {"response": response}

# Image classification functions
def predict_image(image):
    """Predict the class of an image using the FastAI model."""
    pred, pred_idx, probs = image_model.predict(image)  # Using FastAI model here
    return pred, probs[pred_idx].item()

def resize_image(image: Image.Image, size=(640, 640)) -> Image.Image:
    """Resize the image to the specified size."""
    return image.resize(size)

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

    # Resize image to 640x640
    pil_image = resize_image(pil_image)

    # Use FastAI's predict method
    prediction, confidence = predict_image(pil_image)

    return {"prediction": prediction, "confidence": confidence}

@app.websocket("/api/ws/talk")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            intents_list = predict_class(data, chatbot_model)
            response = get_response(intents_list, intents)  # Pass the original JSON-loaded `intents` dict here
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

            # Resize image to 640x640
            pil_image = resize_image(pil_image)

            # Predict using FastAI model
            prediction, confidence = predict_image(pil_image)
            await websocket.send_text(f"{prediction} with confidence {confidence:.4f}")
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)