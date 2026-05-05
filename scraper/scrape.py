import requests
from bs4 import BeautifulSoup
from datetime import date
import pandas as pd
import os

def req():
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    url = "https://ramropatro.com/vegetable"
    response = requests.get(url,headers= headers,timeout= 10)
    response.raise_for_status()

    return response.text
#web scrape :>
def parse(response):
    soup = BeautifulSoup(response, "html.parser")
    rows = []
    #list of dicts
    data_list = []
    table = soup.find('table', id= 'commodityDailyPrice')
    if not table:
        print("Error! Table not found, check the site ")
        #Prevent the valueError
        return data_list
    
    for element in table.find_all("tr")[1:]:

    #individual dicts of all the headings
        data = {}
        cols = element.find_all("td")
        if not cols[0].text.strip():
                continue
        data['Date'] = date.today().isoformat()
        data["Commodity"] = cols[0].text.strip()
        data['Unit'] = cols[1].text.strip()
        data['Minimum value'] = int(cols[2].text.strip().replace(',', ''))
        data['Maximum value'] = int(cols[3].text.strip().replace(',', ''))
        data['Average'] = int(cols[4].text.strip().replace(',', ''))
        data_list.append(data)
    return data_list


def save(dict_list):
    file = 'data/weekly_prices.csv'
    if os.path.exists(file):
        existing = pd.read_csv(file)
        if existing['Date'].iloc[-1] == date.today().isoformat():
            print("alr done with scraping today")
            return
    
    df = pd.DataFrame(dict_list)
    df.to_csv(file, mode='a', header=not os.path.exists(file), index=False)
    print("Successfully scraped and stored")

if __name__ == "__main__":
    res = req()
    try:
        dicts = parse(res)
    except IndexError:
        print("Maybe check the columns on the original website")
        exit(1)
    save(dicts)