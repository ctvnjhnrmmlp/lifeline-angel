import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.optimizers import Adam

# Define image size and number of classes
img_size = 180
num_classes = 5  # Total number of wound classes

# Data augmentation and normalization
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

# Load train and validation data
train_data = train_datagen.flow_from_directory(
    './datasets/train',
    target_size=(img_size, img_size),
    batch_size=32,
    class_mode='categorical',
    subset='training'
)

validation_data = train_datagen.flow_from_directory(
    './datasets/test',
    target_size=(img_size, img_size),
    batch_size=32,
    class_mode='categorical',
    subset='validation'
)

# Transfer learning: EfficientNetB0 without the top layer
base_model = EfficientNetB0(include_top=False, input_shape=(img_size, img_size, 3), weights='imagenet')
base_model.trainable = False  # Freeze the base model

# Build the model
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(num_classes, activation='softmax')
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.001),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Model summary
model.summary()

# Train the model
history = model.fit(
    train_data,
    epochs=20,
    validation_data=validation_data
)

# Unfreeze some layers for fine-tuning
base_model.trainable = True
fine_tune_at = len(base_model.layers) // 2  # Unfreeze half of the layers

for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

# Recompile with a lower learning rate
model.compile(optimizer=Adam(learning_rate=1e-5), loss='categorical_crossentropy', metrics=['accuracy'])

# Fine-tune the model
history_fine = model.fit(
    train_data,
    epochs=10,
    validation_data=validation_data
)

# Load and preprocess test data
test_datagen = ImageDataGenerator(rescale=1./255)
test_data = test_datagen.flow_from_directory(
    './datasets/test',
    target_size=(img_size, img_size),
    batch_size=32,
    class_mode='categorical'
)

# Evaluate the model on test data
test_loss, test_acc = model.evaluate(test_data)
print(f'Test accuracy: {test_acc}')

model.save('image_model.h5')
