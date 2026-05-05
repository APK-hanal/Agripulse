import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from scraper.scrape import req, parse, save
from scraper.parser import read_db,save_parsed
from scripts.seed_db import load_csv, build_rows, insert_to_db

# run them
if __name__ == "__main__":
    # scraper
    response = req()
    try:
        result = parse(response)
        save(result)
        # parser 
        df = read_db()
        save_parsed(df)
        print("Sucessfuly parsed")
        file = 'data/parsed_prices.csv'
        df_2 = load_csv(file)
        rows = build_rows(df_2)
        insert_to_db(rows)
        print("Sucessfully inserted")
    except Exception as e:
        print(f"Error {e}")
    

