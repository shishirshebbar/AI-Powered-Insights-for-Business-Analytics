from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import duckdb
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

csv_df = None  # Global CSV data

class QueryRequest(BaseModel):
    prompt: str

@app.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...)):
    global csv_df
    try:
        contents = await file.read()
        path = f"temp_{file.filename}"
        with open(path, "wb") as f:
            f.write(contents)
        csv_df = pd.read_csv(path)
        os.remove(path)
        return {"message": "CSV uploaded", "rows": len(csv_df)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading CSV: {e}")

@app.post("/generate_sql/")
async def generate_sql_route(query: QueryRequest):
    prompt = query.prompt.lower()
    if "average opening price" in prompt:
        return {"sql_query": "SELECT ticker_symbol, AVG(opening_price) as avg_opening_price FROM uploaded_data GROUP BY ticker_symbol;"}
    elif "average closing" in prompt:
        return {"sql_query":"SELECT AVG(closing_price) AS avg_closing_price FROM uploaded_data"}
    elif "max closing" in prompt:
        return {"sql_query":"SELECT MAX(closing_price) AS max_closing_price FROM uploaded_data"}
    elif "min opening" in prompt:
        return {"sql_query":"SELECT MIN(opening_price) AS min_opening_price FROM uploaded_data"}
    elif "highest volume" in prompt:
        return {"sql_query":"SELECT date, volume FROM uploaded_data ORDER BY volume DESC LIMIT 1"}
    elif "average closing by ticker" in prompt or "group by ticker" in prompt:
        return {"sql_query":"SELECT ticker_symbol, AVG(closing_price) AS avg_close FROM uploaded_data GROUP BY ticker_symbol"}
    else:
        raise HTTPException(status_code=400, detail="Unsupported prompt")

@app.post("/run_query/")
async def run_query(query: QueryRequest):
    global csv_df
    if csv_df is None:
        raise HTTPException(status_code=400, detail="CSV not uploaded")
    try:
        con = duckdb.connect()
        con.register("uploaded_data", csv_df)
        df = con.execute(query.prompt).fetchdf()
        return {"results": df.to_dict(orient="records")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {e}")
