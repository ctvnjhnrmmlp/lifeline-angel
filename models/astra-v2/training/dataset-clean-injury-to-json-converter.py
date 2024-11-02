import pandas as pd
import json

# Load the Excel file
excel_file = 'dataset-clean-injury.xlsx'  # Replace this with your actual Excel file path
df = pd.read_excel(excel_file)

# Create an empty list to store JSON data
intents_list = []

# Loop through the DataFrame and process each row
for index, row in df.iterrows():
    intent = {
        "tag": row['Tag'],
        "type": row['Type (Injury or Treatment)'],
        "meaning": row['Meaning'],
        "patterns": [pattern.strip() for pattern in str(row['Patterns']).split('\n')],
        "procedures": [procedure.strip() for procedure in str(row['Procedures']).split('\n')],
        "relations": [relation.strip() for relation in str(row['Relations (Treatment or Procedures)']).split('\n')],
        "references": [reference.strip() for reference in str(row['References']).split('\n')],
        # Check if 'Context Set' is NaN, if so, set it to an empty string
        "context_set": "" if pd.isna(row.get('Context Set')) else row['Context Set']
    }
    
    # Append each processed intent to the list
    intents_list.append(intent)

# Create the final JSON structure
output_json = {
    "intents": intents_list
}

# Convert the list to a JSON string and export to a file
with open('dataset-clean-injury.json', 'w') as json_file:
    json.dump(output_json, json_file, indent=4)

print("Excel data has been successfully converted to JSON")
