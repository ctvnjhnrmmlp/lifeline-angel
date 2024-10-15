import pandas as pd
import json

# Load the Excel file into a DataFrame
df = pd.read_excel('dataset-clean.xlsx')

# Initialize an empty list for the intents
intents = []

# Loop through each row in the DataFrame
for _, row in df.iterrows():
    intent = {
        "tag": row["Tag"],
        "type": row["Type"],
        "meaning": row["Meaning"],
        "patterns": row["Patterns"].split("\n"),  # Convert the patterns to an array
        "procedures": row["Procedures"].split("\n"),  # Convert the procedures to an array
        "relations": row["Relations"].split("\n"),  # Convert the procedures to an array
        "references": row["References"].split("\n"),  # Convert the links to an array
        "context_set": row["Context Set"] if pd.notna(row["Context Set"]) else ""  # Handle empty context_set
    }
    intents.append(intent)

# Create the final JSON structure
json_data = {
    "intents": intents
}

# Convert to JSON string
json_output = json.dumps(json_data, indent=4)

# Save the JSON output to a file
with open('dataset-clean.json', 'w') as json_file:
    json_file.write(json_output)

print("JSON file generated successfully!")
