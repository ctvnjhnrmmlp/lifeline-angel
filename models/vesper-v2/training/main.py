import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from fastai.vision.all import *
from sklearn.metrics import confusion_matrix
import torch

# Initialize an empty dictionary to store the file paths and associated class labels
data = {'Path': [], 'Class': []}

# Specify the path to your local dataset directory containing class subfolders
dataset_path = r'./datasets'
entries = os.listdir(dataset_path)  # List all entries in the dataset directory

# Loop through each entry in the dataset directory
for entry in entries:
    full_path = os.path.join(dataset_path, entry)
    if os.path.isdir(full_path):  # Check if entry is a directory (i.e., a class folder)
        files = os.listdir(full_path)
        # Loop through each file in the class folder
        for file in files:
            file_path = os.path.join(full_path, file)
            # Append relative path and class label (folder name) to data dictionary
            data['Path'].append(os.path.join(entry, file))
            data['Class'].append(entry)

# Convert the data dictionary into a DataFrame for easier handling and analysis
df = pd.DataFrame(data)

# Create a count plot to visualize the distribution of classes in the dataset
plt.figure(figsize=(10, 6))
sns.countplot(data=df, x='Class')
plt.title('Class Distribution')
plt.xlabel('Class')
plt.ylabel('Number')
plt.xticks(rotation=90)  # Rotate x-axis labels for better readability
plt.tight_layout()
plt.savefig('./class-distribution.png')  # Save the plot as an image file
plt.show()  # Display the plot

# Initialize FastAI's ImageDataLoaders using the DataFrame, specifying columns for file paths and labels
dataloaders = ImageDataLoaders.from_df(df,
                                       path=dataset_path,  # Base path for image files
                                       fn_col='Path',  # Column containing file paths
                                       label_col='Class',  # Column containing class labels
                                       item_tfms=Resize(224),  # Resize images to 224x224
                                       batch_tfms=aug_transforms())  # Apply data augmentation

# Create a learner object and set accuracy as the metric
learn = vision_learner(dataloaders, resnet34, metrics=accuracy)

# Define a range of epochs to test for model fine-tuning
epochs = [1, 2, 5, 10, 15, 20]
acc_s = []  # List to store accuracy for each epoch

# Loop through each epoch value to train the model and record accuracy
for epoch in epochs:
    learn.fine_tune(epoch)  # Fine-tune the model for the current number of epochs
    interp = ClassificationInterpretation.from_learner(learn)
    acc = interp.confusion_matrix().diagonal().sum() / interp.confusion_matrix().sum()  # Calculate accuracy
    acc_s.append(acc)  # Append accuracy to the list

# Plot the relationship between number of epochs and accuracy
plt.plot(epochs, acc_s, marker='o')
plt.xlabel('Number of Epochs')
plt.ylabel('Accuracy')
plt.title('Accuracy vs Number of Training Epochs')
plt.grid(True)
plt.savefig('./epochs-accuracy.png')  # Save the accuracy plot as an image
plt.show()  # Display the plot

# Reinitialize the learner and fine-tune for a longer duration (20 epochs) for better performance
learn = vision_learner(dataloaders, resnet34, metrics=accuracy)
learn.fine_tune(20)

# Generate and display the confusion matrix to assess model performance
interp = ClassificationInterpretation.from_learner(learn)
interp.plot_confusion_matrix()

# Save the trained model as a pickle file for later use
learn.export('./vesper.pkl')

# Define a function to obtain predictions for a given dataloader
def get_preds(dl):
    inputs, targets, outputs = [], [], []  # Lists to store data and predictions
    for batch in dl:
        with torch.no_grad():  # Disable gradient computation for faster performance
            preds = learn.model(batch[0])  # Get predictions from the model
            outputs.extend(preds.argmax(dim=1).cpu().numpy())  # Predicted classes
            targets.extend(batch[1].cpu().numpy())  # Actual classes
            inputs.extend(batch[0].cpu().numpy())  # Input images
    return inputs, targets, outputs

# Get predictions for both training and validation sets
train_inputs, train_targets, train_outputs = get_preds(learn.dls.train)
val_inputs, val_targets, val_outputs = get_preds(learn.dls.valid)

# Combine predictions and actual labels from training and validation sets
all_targets = train_targets + val_targets
all_outputs = train_outputs + val_outputs

# Create a confusion matrix using combined targets and outputs from both sets
cm = confusion_matrix(all_targets, all_outputs)
labels = learn.dls.vocab  # Retrieve class labels from the data loaders

# Create a figure and axis for the heatmap
fig, ax = plt.subplots(figsize=(12, 10))  # Set figure size
sns.heatmap(cm, annot=True, fmt='g', cmap='Blues', xticklabels=labels, yticklabels=labels, ax=ax)
ax.set_xlabel('Predicted')  # X-axis label
ax.set_ylabel('Actual')  # Y-axis label
ax.set_title('Confusion Matrix')  # Title of the plot

# Save the confusion matrix as an image file
fig.savefig('./confusion-matrix.png', dpi=300)

# Show the plot
plt.show()
