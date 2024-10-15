import json
import pandas as pd

# Load JSON from a file
with open('./dataset.json') as file:
    data = json.load(file)

# Extracting data for Excel
rows = []
for intent in data["intents"]:
    tag = intent["tag"]
    patterns = "\n".join(intent["patterns"])
    procedures = "\n".join(intent["procedures"])
    links = "\n".join(intent["links"])
    context_set = intent["context_set"]
    
    # Append the row data
    rows.append([tag, patterns, procedures, links, context_set])

# Create a DataFrame
df = pd.DataFrame(rows, columns=["Tag", "Patterns", "Procedures", "Links", "Context Set"])

# Save to Excel
excel_path = "converted-dataset.xlsx"
df.to_excel(excel_path, index=False)

print(f"Data has been saved to {excel_path}")
