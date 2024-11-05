import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import SGD

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Load intents dataset with error handling
try:
    with open('dataset.json', 'r') as file:
        intents = json.load(file)
except FileNotFoundError:
    print("Error: dataset.json not found.")
    exit()

# Initialize lists to store data
words, classes, documents = [], [], []
ignore_chars = ['?', '!', '.', ',']

# Tokenize, lemmatize, and collect patterns and classes from the intents dataset
for intent in intents.get('intents', []):
    for pattern in intent.get('patterns', []):
        word_list = nltk.word_tokenize(pattern)
        words.extend(word_list)
        documents.append((word_list, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize, lower, and remove duplicates from words, ignoring special characters
words = sorted(set(lemmatizer.lemmatize(word.lower()) for word in words if word not in ignore_chars))

# Sort classes to maintain consistent order
classes = sorted(set(classes))

# Save words and classes using pickle for future use
with open('words.pkl', 'wb') as file:
    pickle.dump(words, file)
with open('classes.pkl', 'wb') as file:
    pickle.dump(classes, file)

# Prepare training data
training_data = []
output_empty = [0] * len(classes)

# Create the bag of words model
for word_list, tag in documents:
    # Bag of words for the current pattern
    bag = [1 if word in [lemmatizer.lemmatize(w.lower()) for w in word_list] else 0 for word in words]
    
    # Output is '1' for the current tag and '0' for others
    output_row = list(output_empty)
    output_row[classes.index(tag)] = 1

    training_data.append([np.array(bag), np.array(output_row)])

# Shuffle and convert to numpy array
random.shuffle(training_data)
training_data = np.array(training_data, dtype=object)

# Split data into input (X) and output (Y)
train_x = np.array([data[0] for data in training_data])
train_y = np.array([data[1] for data in training_data])

# Build a Sequential neural network model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.3))  # Reduced dropout for the second layer
model.add(Dense(len(train_y[0]), activation='softmax'))

# Compile the model using SGD with nesterov momentum
sgd = SGD(learning_rate=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Train the model (you may want to adjust epochs and batch_size based on your dataset)
hist = model.fit(train_x, train_y, epochs=300, batch_size=8, verbose=1)  # Reduced epochs for faster testing

# Save the trained model
model.save('astra.h5')
print("Training complete and model saved.")
