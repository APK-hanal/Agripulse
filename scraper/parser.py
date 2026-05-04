import pandas as pd
import re

df = pd.read_csv('data/weekly_prices.csv')

# Clean column names
df.columns = df.columns.str.strip()

def parse_commodity(name):
    """
    'Tomato Big(Indian)' -> name='tomato', type='big', location='indian'
    'Potato Red'         -> name='potato', color='red'
    """
    name_original = name.strip()
    name_lower = name_original.lower()
    
    # Extract location/origin from parentheses e.g. (Indian), (Local)
    location_match = re.search(r'\(([^)]+)\)', name_lower)
    location = location_match.group(1).strip() if location_match else None
    
    # Remove the parentheses part for further parsing
    base = re.sub(r'\([^)]*\)', '', name_lower).strip()
    
    # Known types
    types = ['big', 'small', 'medium', 'large', 'dry', 'wet', 'long', 'round']
    
    # Known colors
    colors = ['red', 'white', 'green', 'yellow', 'black', 'pink', 'purple']
    
    tokens = base.split()
    commodity_name = tokens[0] if tokens else base  # first word is always the commodity
    
    detected_type = None
    detected_color = None
    
    for token in tokens[1:]:
        if token in types:
            detected_type = token
        elif token in colors:
            detected_color = token
    
    return pd.Series({
        'name_original': name_original,
        'name':          commodity_name,
        'type':          detected_type,
        'color':         detected_color,
        'location':      location,
    })

# Parse the commodity column
parsed = df['Commodity'].apply(parse_commodity)

# Build final dataframe
result = pd.DataFrame({
    'name_original': parsed['name_original'],
    'name':          parsed['name'],
    'type':          parsed['type'],
    'color':         parsed['color'],
    'location':      parsed['location'],
    'date':          pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d'),
    'unit':          df['Unit'].str.lower().str.strip(),
    'maximum':       df['Maximum value'],
    'minimum':       df['Minimum value'],
    'average':       df['Average'],
})

result.to_csv('data/parsed_prices.csv', index=False)