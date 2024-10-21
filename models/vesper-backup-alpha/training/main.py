import tensorflow as tf
from tensorflow.keras import layers, models

# Define paths to dataset directories
train_dir = 'dataset/train'
test_dir = 'dataset/test'

# Load and preprocess the dataset
batch_size = 32
img_height = 180
img_width = 180

# Data augmentation
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
])

# Load training dataset
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    train_dir,
    image_size=(img_height, img_width),
    batch_size=batch_size,
    label_mode='int'  # Labels are integers
)

# Load testing dataset
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
    dataset = dataset.map(lambda x, y: (normalization_layer(data_augmentation(x)), y))
    dataset = dataset.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
    return dataset

train_ds = preprocess_ds(train_ds)
test_ds = preprocess_ds(test_ds)

# Build the model with an increased number of filters
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(img_height, img_width, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(256, (3, 3), activation='relu'),  # Increased filters
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(len(class_names), activation='softmax')  # Output units match number of classes
])

# Compile the model with learning rate scheduling
initial_learning_rate = 0.001
lr_schedule = tf.keras.callbacks.LearningRateScheduler(
    lambda epoch: initial_learning_rate * 0.5 ** (epoch // 10)
)

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=initial_learning_rate),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Add callbacks for early stopping and model checkpoint
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint(filepath='image_model_checkpoint.keras', save_best_only=True)  # Updated to TensorFlow format
]

# Train the model
model.fit(train_ds, epochs=20, validation_data=test_ds, callbacks=callbacks)

# Evaluate the model
loss, accuracy = model.evaluate(test_ds)
print(f"Loss: {loss}")
print(f"Accuracy: {accuracy}")

# Save the model
model.save("image_model.h5")
