from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image

# Load the saved model
model = load_model('image_model.h5')

# Function to preprocess input image
def preprocess_image(image_path):
    img = Image.open(image_path)
    img = img.resize((180, 180))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Function to make predictions
def predict(image_path):
    img_array = preprocess_image(image_path)
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions)
    return predicted_class

classification = predict('./datasets/test/laserations/laseration (32).jpg')
print(classification)