from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.database import get_connection

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