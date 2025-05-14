from pydantic import BaseModel
from typing import List, Optional

# Used to pass natural language voice prompt
class QueryRequest(BaseModel):
    prompt: str

# Optional: if you're returning structured results
class SQLQueryResponse(BaseModel):
    query: str
    result: Optional[List[dict]]
    message: str
