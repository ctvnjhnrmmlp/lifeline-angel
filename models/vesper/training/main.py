import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from fastai.vision.all import *
from sklearn.metrics import confusion_matrix
import torch

# Step 1: Prepare Data
data = {'Path': [], 'Class': []}

# Update this with the path to your local dataset
dataset_path = r'./datasets'
entries = os.listdir(dataset_path)

for entry in entries:
    full_path = os.path.join(dataset_path, entry)
    if os.path.isdir(full_path):
        files = os.listdir(full_path)
        for file in files:
            file_path = os.path.join(full_path, file)
            data['Path'].append(os.path.join(entry, file))  # Store relative path
            data['Class'].append(entry)  # Store the class (folder name)

df = pd.DataFrame(data)

# Step 2: Plot Class Distribution
plt.figure(figsize=(10, 6))
sns.countplot(data=df, x='Class')
plt.title('Class Distribution')
plt.xlabel('Class')
plt.ylabel('Number')
plt.xticks(rotation=90)
plt.tight_layout()
plt.savefig('./class-distribution.png')  # Save locally
plt.show()

# Step 3: Load Data using FastAI
dataloaders = ImageDataLoaders.from_df(df,
                                      path=dataset_path,  # Local dataset path
                                      fn_col='Path',
                                      label_col='Class',
                                      item_tfms=Resize(224),
                                      batch_tfms=aug_transforms())

# Step 4: Train the Model
learn = vision_learner(dataloaders, resnet34, metrics=accuracy)

# Epochs tuning
epochs = [1, 2, 5, 10, 15, 20]
acc_s = []

for epoch in epochs:
    learn.fine_tune(epoch)
    interp = ClassificationInterpretation.from_learner(learn)
    acc = interp.confusion_matrix().diagonal().sum() / interp.confusion_matrix().sum()
    acc_s.append(acc)

# Step 5: Plot Accuracy vs Epochs
plt.plot(epochs, acc_s, marker='o')
plt.xlabel('Number of Epochs')
plt.ylabel('Accuracy')
plt.title('Accuracy vs Number of Training Epochs')
plt.grid(True)
plt.savefig('./epochs-accuracy.png')  # Save locally
plt.show()

# Step 6: Fine-tune the Model with More Epochs
learn = vision_learner(dataloaders, resnet34, metrics=accuracy)
learn.fine_tune(20)

# Step 7: Confusion Matrix Interpretation
interp = ClassificationInterpretation.from_learner(learn)
interp.plot_confusion_matrix()

# Step 8: Export the Model
learn.export('./model.pkl')  # Save model locally

# Step 9: Get Predictions for Confusion Matrix
def get_preds(dl):
    inputs, targets, outputs = [], [], []
    for batch in dl:
        with torch.no_grad():
            preds = learn.model(batch[0])
            outputs.extend(preds.argmax(dim=1).cpu().numpy())
            targets.extend(batch[1].cpu().numpy())
            inputs.extend(batch[0].cpu().numpy())
    return inputs, targets, outputs

# Get predictions for both training and validation sets
train_inputs, train_targets, train_outputs = get_preds(learn.dls.train)
val_inputs, val_targets, val_outputs = get_preds(learn.dls.valid)

# Combine predictions
all_targets = train_targets + val_targets
all_outputs = train_outputs + val_outputs

# Step 10: Generate Confusion Matrix
cm = confusion_matrix(all_targets, all_outputs)
labels = learn.dls.vocab

# Create a figure and axis object
fig, ax = plt.subplots(figsize=(12, 10))  # Adjust size as needed
sns.heatmap(cm, annot=True, fmt='g', cmap='Blues', xticklabels=labels, yticklabels=labels, ax=ax)
ax.set_xlabel('Predicted')
ax.set_ylabel('Actual')
ax.set_title('Confusion Matrix')

# Save the figure locally
fig.savefig('./confusion-matrix.png', dpi=300)

# Show the plot
plt.show()
