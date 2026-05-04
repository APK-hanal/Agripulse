# One time addition of the historical data csv into a database
import pandas as pd
import sys
import os
from psycopg2.extras import execute_values

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from backend.app.database import get_connection
conn = get_connection()
cur = conn.cursor()

file = pd.read_csv('data/parsed_prices.csv')
df = pd.DataFrame(file)
# Convert null to None
df = df.where(pd.notna(df), other=None)
df['date'] = pd.to_datetime(df['date']).dt.date


rows = []
for index,row in df.iterrows():
    record = (
        row['name_original'],
        row['name'],
        row['type'],
        row['color'],
        row['location'],
        row['date'],
        row['unit'],
        row['maximum'],
        row['minimum'],
        row['average'],
    )
    rows.append(record)
    
try:
    execute_values(cur, """
        INSERT INTO prices_raw (name_original, name, type, color, location, date, unit, maximum, minimum, average)
        VALUES %s
        ON CONFLICT (name_original, date) DO NOTHING
    """, rows)
    conn.commit()
    print(f"{cur.rowcount} rows inserted, {len(rows) - cur.rowcount} skipped as duplicates")
    
except Exception as e:
    conn.rollback()
    print(f"Failed: {e}")
    
finally:
    cur.close()
    conn.close()
