import psycopg2
import pandas as pd
import os
from dotenv import load_dotenv
from psycopg2 import sql

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def connect_db():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        print("Connected to NeonDB")
        return conn
    except Exception as e:
        print("Failed to connect to DB:", e)
        return None

def create_table_if_not_exists(conn, df: pd.DataFrame):
    try:
        with conn.cursor() as cursor:
            column_defs = []
            for col in df.columns:
                col_clean = col.strip().replace(" ", "_").lower()
                dtype = df[col].dtype
                if pd.api.types.is_integer_dtype(dtype):
                    sql_type = "INTEGER"
                elif pd.api.types.is_float_dtype(dtype):
                    sql_type = "NUMERIC"
                elif pd.api.types.is_bool_dtype(dtype):
                    sql_type = "BOOLEAN"
                elif pd.api.types.is_datetime64_any_dtype(dtype):
                    sql_type = "TIMESTAMP"
                else:
                    sql_type = "TEXT"
                column_defs.append(f"{col_clean} {sql_type}")

            create_table_sql = f"""
            CREATE TABLE IF NOT EXISTS uploaded_data (
                {', '.join(column_defs)}
            );
            """
            cursor.execute(create_table_sql)
            print("Table 'uploaded_data' created/validated.")
    except Exception as e:
        print("Error creating table:", e)

def insert_csv_data(conn, df: pd.DataFrame):
    try:
        with conn.cursor() as cursor:
            cols = [col.strip().replace(" ", "_").lower() for col in df.columns]
            placeholders = ", ".join(["%s"] * len(cols))
            insert_stmt = f"INSERT INTO uploaded_data ({', '.join(cols)}) VALUES ({placeholders})"

            for row in df.itertuples(index=False, name=None):
                cursor.execute(insert_stmt, row)

        print("CSV data inserted into 'uploaded_data'")
    except Exception as e:
        print("Error inserting data:", e)

def run_sql_query(conn, sql_query: str) -> pd.DataFrame:
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql_query)
            if cursor.description:
                columns = [desc[0] for desc in cursor.description]
                rows = cursor.fetchall()
                return pd.DataFrame(rows, columns=columns)
            return pd.DataFrame()
    except Exception as e:
        print("SQL query error:", e)
        return pd.DataFrame()