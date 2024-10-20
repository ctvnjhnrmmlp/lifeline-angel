import json
import numpy as np
import pickle
import pandas as pd
import random
import nltk
from nltk.stem import WordNetLemmatizer
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling1D, Embedding
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.callbacks import EarlyStopping
import matplotlib.pyplot as plt

nltk.download('punkt')
nltk.download('wordnet')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Load the dataset
with open('dataset.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Prepare the training data
training_sentences = []
training_labels = []
labels = []
intent_info = {}

for intent in data['intents']:
    for pattern in intent['patterns']:
        training_sentences.append(pattern)
        training_labels.append(intent['tag'])
    
    # Collecting additional info related to each intent
    intent_info[intent['tag']] = {
        "procedures": intent['procedures'],
        "relations": intent['relations'],
        "references": intent['references'],
        "meaning": intent['meaning']
    }
    
    if intent['tag'] not in labels:
        labels.append(intent['tag'])

# Encode labels
lbl_encoder = LabelEncoder()
lbl_encoder.fit(training_labels)
training_labels = lbl_encoder.transform(training_labels)

# Tokenize the data
vocab_size = 1000
embedding_dim = 16
max_len = 20
oov_token = "<OOV>"

tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_token)
tokenizer.fit_on_texts(training_sentences)
word_index = tokenizer.word_index
sequences = tokenizer.texts_to_sequences(training_sentences)
padded_sequences = pad_sequences(sequences, truncating='post', maxlen=max_len)

# Define the model
model = Sequential([
    Embedding(vocab_size, embedding_dim, input_length=max_len),
    GlobalAveragePooling1D(),
    Dense(16, activation='relu'),
    Dropout(0.25),
    Dense(16, activation='relu'),
    Dropout(0.25),
    Dense(len(labels), activation='softmax')
])

# Compile the model
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Early stopping callback
es = EarlyStopping(monitor='loss', mode='min', verbose=1, patience=200)

# Train the model
epochs = 3000
history = model.fit(padded_sequences, np.array(training_labels), epochs=epochs, callbacks=[es])

# Plot training history
pd.DataFrame(history.history).plot(figsize=(8, 5))
plt.show()

# Save the model, tokenizer, and label encoder
model.save("chat_model.h5")
with open('tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
with open('label_encoder.pickle', 'wb') as ecn_file:
    pickle.dump(lbl_encoder, ecn_file, protocol=pickle.HIGHEST_PROTOCOL)

# Save additional intent info (procedures, relations, references)
with open('intent_info.pickle', 'wb') as info_file:
    pickle.dump(intent_info, info_file, protocol=pickle.HIGHEST_PROTOCOL)

# Function to classify user input and generate responses
def classify_intent(user_input):
    # Preprocess input
    sequence = tokenizer.texts_to_sequences([user_input])
    padded_sequence = pad_sequences(sequence, maxlen=max_len, truncating='post')
    
    # Predict the intent
    predicted_class = np.argmax(model.predict(padded_sequence), axis=-1)
    intent = lbl_encoder.inverse_transform(predicted_class)[0]
    
    # Retrieve intent details
    intent_details = intent_info[intent]
    
    response = {
        "intent": intent,
        "meaning": intent_details["meaning"],
        "procedures": intent_details["procedures"],
        "relations": intent_details["relations"],
        "references": intent_details["references"]
    }
    
    return response

# Example usage of the chatbot:
user_input = "How to relieve nasal congestion?"
response = classify_intent(user_input)
print(response)
