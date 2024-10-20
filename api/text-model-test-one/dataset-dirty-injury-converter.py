import json

# Load JSON from a file
with open('./dataset-dirty-injury.json') as file:
    json_data = json.load(file)

# Function to convert JSON data to plain text formatting
def json_to_plain_text(data):
    plain_text = ""
    for intent in data["intents"]:
        plain_text += f"Tag: {intent['tag']}\n"
        plain_text += "Patterns:\n"
        for pattern in intent['patterns']:
            plain_text += f"{pattern}\n"
        plain_text += "Meanings:\n"
        for meaning in intent['meaning']:
            plain_text += f"{meaning}\n"
        plain_text += "Procedures:\n"
        for procedure in intent['procedures']:
            plain_text += f"{procedure}\n"
        plain_text += "Medications:\n"
        for medication in intent['medication']:
            plain_text += f"{medication}\n"
        plain_text += "Links:\n"
        for link in intent['links']:
            plain_text += f"{link}\n"
        plain_text += "\n"
    return plain_text

# Convert the JSON data to plain text format
plain_text_data = json_to_plain_text(json_data)

# Save the plain text data to a file
with open("./dataset-dirty-injury.txt", "w") as text_file:
    text_file.write(plain_text_data)

# Print success message
print("Plain text file generated successfully!")
