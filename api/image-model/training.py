import tensorflow as tf
from tensorflow.keras import layers, models

# Define paths to dataset directories
train_dir = 'dataset/train'
test_dir = 'dataset/test'

# Load and preprocess the dataset
batch_size = 32
img_height = 180
img_width = 180

train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    train_dir,
    image_size=(img_height, img_width),
    batch_size=batch_size,
    label_mode='int'  # Labels are integers
)

test_ds = tf.keras.preprocessing.image_dataset_from_directory(
    test_dir,
    image_size=(img_height, img_width),
    batch_size=batch_size,
    label_mode='int'  # Labels are integers
)

# Get class names from the dataset
class_names = train_ds.class_names

# Normalize pixel values to be between 0 and 1
normalization_layer = layers.Rescaling(1./255)

def preprocess_ds(dataset):
    dataset = dataset.map(lambda x, y: (normalization_layer(x), y))
    dataset = dataset.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
    return dataset

train_ds = preprocess_ds(train_ds)
test_ds = preprocess_ds(test_ds)

# Build the model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(img_height, img_width, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(len(class_names), activation='softmax')  # Output units match number of classes
])

# Compile the model
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Add callbacks for early stopping and model checkpoint
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint(filepath='best_image_model.keras', save_best_only=True)
]

# Train the model
model.fit(train_ds, epochs=20, validation_data=test_ds, callbacks=callbacks)

# Evaluate the model
loss, accuracy = model.evaluate(test_ds)
print(f"Loss: {loss}")
print(f"Accuracy: {accuracy}")

# Save the model
model.save("final_image_model.h5")
