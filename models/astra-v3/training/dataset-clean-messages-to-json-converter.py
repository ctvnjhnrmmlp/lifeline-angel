import pandas as pd
import json

# Load the Excel file
excel_file = 'dataset-clean-messages.xlsx'  # Replace this with your actual Excel file path
df = pd.read_excel(excel_file)

# Create an empty list to store JSON data
intents_list = []

# Loop through the DataFrame and process each row
for index, row in df.iterrows():
    intent = {
        "tag": row['Tag'],
        "type": row['Type (Injury or Treatment)'],
        "meaning": [meaning.strip() for meaning in str(row['Meaning']).split('\n')],
        "patterns": [pattern.strip() for pattern in str(row['Patterns']).split('\n')],
        "procedures": [],
        "relations": [],
        "references": [],
        "context_set": ""
    }
    
    # Append each processed intent to the list
    intents_list.append(intent)

# Create the final JSON structure
output_json = {
    "intents": intents_list
}

# Convert the list to a JSON string and export to a file
with open('dataset-clean-messages.json', 'w') as json_file:
    json.dump(output_json, json_file, indent=4)

print("Excel data has been successfully converted to JSON")
