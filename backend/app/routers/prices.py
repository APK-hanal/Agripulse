from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.app.database import get_connection

router = APIRouter()

@router.get("/commodities")
def get_commodities():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT canonical_name, category FROM commodity_map WHERE include = true ORDER BY canonical_name")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    formatted_data = []
    for row in rows:
        item = {"name" : row[0],
         "category": row[1]}
        formatted_data.append(item)
    return formatted_data

@router.get("/prices/{commodity}")
def get_prices(commodity: str, start: Optional[str] = Query(None), end: Optional[str] = Query(None)):
    conn = get_connection()
    cur = conn.cursor()
    params = [commodity]
    query = """
        SELECT date, min_price, max_price, avg_price
        FROM prices_aggregated
        WHERE commodity = %s
    """
    if start:
        query+= " AND date >= %s"
        params.append(start)
    if end:
        query += " and date <= %s"
        params.append(end)
    query += " order by date"
    cur.execute(query,params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    if not rows:
        raise HTTPException(status_code=404, detail="Commodity not found /or/ no data")
    
    details = []
    for row in rows:
        item_dict = {
            "date":str(row[0]), # since json isnt compatible with date formats
            "min":row[1],
            "max":row[2],
            "avg":row[3]
        }
        details.append(item_dict)
        
    return details

@router.get("/prices/{commodity}/summary")
def get_summary(commodity:str):
    conn = get_connection()
    cur = conn.cursor()
    query = """
        select 
        extract(year from "date") as year,
        extract(month from "date") as month,
        round(avg(avg_price)::numeric, 2) as avg_price
        from prices_aggregated
        where commodity = %s
        GROUP BY year, month
        ORDER BY year, month
        """
    cur.execute(query, [commodity])
    rows = cur.fetchall()
    cur.close()
    conn.close()
    if not rows:
        raise HTTPException(status_code=404, detail="Commodity not found")
    details = []
    for row in rows:
        info ={
            "year":int(row[0]), #cause apparently postgres gives a float as year and month 
            "month":int(row[1]),
            "avg":float(row[2])
        }
        details.append(info)
    return details
    