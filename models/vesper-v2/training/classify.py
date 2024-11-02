from fastai.vision.all import *
import sys
import argparse

# Step 1: Load the exported model
def load_model(model_path):
    learn = load_learner(model_path)
    return learn

# Step 2: Predict the class of the wound from an image
def predict_image(learn, image_path):
    img = PILImage.create(image_path)
    pred, pred_idx, probs = learn.predict(img)
    return pred, probs[pred_idx]

# Step 3: Main function to handle input arguments and run predictions
def main(args):
    model_path = args.model
    image_path = args.image
    
    print(f"Loading model from: {model_path}")
    learn = load_model(model_path)
    
    print(f"Predicting for image: {image_path}")
    pred, confidence = predict_image(learn, image_path)
    
    print(f"Prediction: {pred}")
    print(f"Confidence: {confidence:.4f}")

if __name__ == "__main__":
    # Step 4: Argument parsing to run the script from the command line
    parser = argparse.ArgumentParser(description="Wound Classification Script")
    parser.add_argument('--model', type=str, required=True, help='Path to the trained model (model.pkl)')
    parser.add_argument('--image', type=str, required=True, help='Path to the image to predict')

    args = parser.parse_args()
    main(args)
