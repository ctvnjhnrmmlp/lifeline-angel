import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

nltk.download('popular')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Load intents, words, classes, and model with error handling
def load_files():
    try:
        with open('intents.json') as file:
            intents_data = json.load(file)
    except FileNotFoundError:
        raise FileNotFoundError("Error: 'intents.json' not found.")
    
    try:
        with open('words.pkl', 'rb') as file:
            words_data = pickle.load(file)
        with open('classes.pkl', 'rb') as file:
            classes_data = pickle.load(file)
    except FileNotFoundError:
        raise FileNotFoundError("Error: 'words.pkl' or 'classes.pkl' not found.")

    try:
        model_data = load_model('text_model.h5')
    except Exception as e:
        raise Exception(f"Error loading model: {e}")

    return intents_data, words_data, classes_data, model_data

intents, words, classes, model = load_files()

# Clean up sentence by tokenizing and lemmatizing words
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

# Convert the sentence into a bag of words
def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        if w in words:
            bag[words.index(w)] = 1
    return np.array(bag)

# Predict the class (intent) based on the input sentence
def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25

    results = [
        {'intent': classes[i], 'probability': float(r)}
        for i, r in enumerate(res) if r > ERROR_THRESHOLD
    ]
    # Sort by probability score, highest first
    results.sort(key=lambda x: x['probability'], reverse=True)
    return results

# Get the response based on predicted intent
def get_response(intents_list, intents_json):
    if not intents_list:
        return "Sorry, I didn't understand that."
    
    intent_tag = intents_list[0]['intent']
    for intent in intents_json['intents']:
        if intent['tag'] == intent_tag:
            return random.choice(intent['responses'])
    return "Sorry, I couldn't find a response for that."

# Main chatbot loop
if __name__ == "__main__":
    print("Chatbot is running! Type 'quit' to exit.")
    
    while True:
        message = input("You: ").strip()
        if message.lower() == 'quit':
            print("Goodbye!")
            break
        
        if message == '':
            print("Bot: Please enter a message.")
            continue

        intents = predict_class(message)
        response = get_response(intents, intents)
        print(f"Bot: {response}")
