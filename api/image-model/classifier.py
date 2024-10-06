import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras import models
import cv2 as cv

# Define class names
class_names = ['Abrasions', 'Bruises', 'Burns', 'Cuts', 'Laceration']

model = models.load_model('image_model.keras')

# Load, resize, and preprocess the image
image = cv.imread('./laseration.jpg')
image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
image = cv.resize(image, (180, 180))  # Updated to match the model input size

plt.imshow(image)

# Expand dimensions to match the model input
image = np.expand_dims(image, axis=0)

# Normalize pixel values
image = image / 255.0

prediction = model.predict(image)
index = np.argmax(prediction)
print(f"Prediction: {class_names[index]}")
