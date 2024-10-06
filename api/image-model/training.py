import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ReduceLROnPlateau

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

# Data augmentation layer
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
])

def preprocess_ds(dataset):
    dataset = dataset.map(lambda x, y: (normalization_layer(x), y))
    dataset = dataset.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
    return dataset

train_ds = train_ds.map(lambda x, y: (data_augmentation(x, training=True), y))
train_ds = preprocess_ds(train_ds)
test_ds = preprocess_ds(test_ds)

# Build the model using Transfer Learning (MobileNetV2)
base_model = MobileNetV2(input_shape=(img_height, img_width, 3), include_top=False, weights='imagenet')
base_model.trainable = False  # Freeze the base model

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.5),  # Add dropout to prevent overfitting
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(len(class_names), activation='softmax')  # Output units match number of classes
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.001),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Add callbacks for early stopping, learning rate reduction, and model checkpoint
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint(filepath='image_model.keras', save_best_only=True),
    ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-6)
]

# Train the model
model.fit(train_ds, epochs=20, validation_data=test_ds, callbacks=callbacks)

# Evaluate the model
loss, accuracy = model.evaluate(test_ds)
print(f"Loss: {loss}")
print(f"Accuracy: {accuracy}")

# Save the model
model.save("image_model.h5")
