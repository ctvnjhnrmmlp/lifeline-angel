import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import SGD

# Initialize the WordNet lemmatizer for normalizing words
lemmatizer = WordNetLemmatizer()

# Load the intents dataset from a JSON file with error handling for missing files
try:
    with open('dataset.json', 'r') as file:
        intents = json.load(file)
except FileNotFoundError:
    print("Error: dataset.json not found.")
    exit()

# Initialize lists to store unique words, tags (classes), and pattern-tag pairs (documents)
words, classes, documents = [], [], []
ignore_chars = ['?', '!', '.', ',']  # Characters to ignore when tokenizing

# Process each intent in the dataset to extract patterns and corresponding tags
for intent in intents.get('intents', []):
    for pattern in intent.get('patterns', []):
        # Tokenize the pattern sentence into words
        word_list = nltk.word_tokenize(pattern)
        words.extend(word_list)  # Add words to the main word list
        documents.append((word_list, intent['tag']))  # Associate the pattern words with the tag
        if intent['tag'] not in classes:
            classes.append(intent['tag'])  # Add tag to classes if it's not already present

# Lemmatize and normalize words to lowercase, removing duplicates and ignoring specified characters
words = sorted(set(lemmatizer.lemmatize(word.lower()) for word in words if word not in ignore_chars))

# Sort the classes alphabetically to maintain consistent ordering
classes = sorted(set(classes))

# Save the processed words and classes as pickle files for future use
with open('words.pkl', 'wb') as file:
    pickle.dump(words, file)
with open('classes.pkl', 'wb') as file:
    pickle.dump(classes, file)

# Prepare training data by converting patterns into bag-of-words vectors and tagging classes
training_data = []
output_empty = [0] * len(classes)  # Template for output vector with all zeros

# Create a bag-of-words representation for each pattern
for word_list, tag in documents:
    # Initialize the bag with 0s for each known word in the vocabulary
    bag = [1 if word in [lemmatizer.lemmatize(w.lower()) for w in word_list] else 0 for word in words]
    
    # Set the output to 1 for the index of the current tag, 0 for others
    output_row = list(output_empty)
    output_row[classes.index(tag)] = 1

    # Add the bag-of-words vector and the corresponding output vector to training data
    training_data.append([np.array(bag), np.array(output_row)])

# Shuffle the training data to improve model generalization
random.shuffle(training_data)
training_data = np.array(training_data, dtype=object)  # Convert list to a numpy array

# Separate the training data into input (X) and output (Y) components
train_x = np.array([data[0] for data in training_data])  # Bag of words vectors
train_y = np.array([data[1] for data in training_data])  # Output class vectors

# Build a Sequential neural network model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))  # First hidden layer with ReLU activation
model.add(Dropout(0.5))  # Dropout layer to prevent overfitting
model.add(Dense(64, activation='relu'))  # Second hidden layer
model.add(Dropout(0.3))  # Dropout with a lower rate on the second layer
model.add(Dense(len(train_y[0]), activation='softmax'))  # Output layer with softmax for multi-class classification

# Compile the model using Stochastic Gradient Descent (SGD) optimizer with nesterov momentum
sgd = SGD(learning_rate=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Train the model; adjust epochs and batch size as needed based on dataset size and hardware
hist = model.fit(train_x, train_y, epochs=300, batch_size=8, verbose=1)  # Training the model

# Save the trained model to disk for future use in making predictions
model.save('astra.h5')
print("Training complete and model saved.")
