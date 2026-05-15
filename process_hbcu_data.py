import pandas as pd
import json

# Load the CSV file
df = pd.read_csv('HBCUIPEDS.csv')

# Get unique universities
universities = df['INSTNM'].unique()

# For each university, get top 5 awarded programs
result = {}
for uni in universities:
    uni_df = df[df['INSTNM'] == uni]
    top5 = uni_df.sort_values('AWARDSTOTAL', ascending=False).head(5)
    degrees = [
        {
            "cip": str(row['CIPCODE']),
            "name": row['CIPDESC'],
            "awards": int(row['AWARDSTOTAL'])
        }
        for _, row in top5.iterrows()
    ]
    result[uni] = {
        "degrees": degrees,
        "year": 2025  # Update if you want to use a dynamic year
    }

# Save as JSON for React frontend
with open('public/data/hbcu_degrees.json', 'w') as f:
    json.dump(result, f, indent=2)