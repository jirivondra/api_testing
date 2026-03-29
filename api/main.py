from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from typing import Optional
import uvicorn
import secrets
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TODO API", version="1.0.0")
security = HTTPBasic()

API_USERNAME = os.getenv("API_USERNAME")
API_PASSWORD = os.getenv("API_PASSWORD")

if not API_USERNAME or not API_PASSWORD:
    raise RuntimeError("API_USERNAME and API_PASSWORD must be set in .env")

# In-memory storage
todos: dict[int, dict] = {}
next_id = 1


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, API_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, API_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/todos", summary="Get all TODOs")
def get_todos(_=Depends(authenticate)):
    return list(todos.values())


@app.post("/todos", status_code=201, summary="Create a TODO")
def create_todo(todo: TodoCreate, _=Depends(authenticate)):
    global next_id
    item = {"id": next_id, **todo.model_dump()}
    todos[next_id] = item
    next_id += 1
    return item


@app.get("/todos/{todo_id}", summary="Get a TODO by ID")
def get_todo(todo_id: int, _=Depends(authenticate)):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="TODO not found")
    return todos[todo_id]


@app.put("/todos/{todo_id}", summary="Update a TODO")
def update_todo(todo_id: int, todo: TodoUpdate, _=Depends(authenticate)):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="TODO not found")
    stored = todos[todo_id]
    updates = todo.model_dump(exclude_unset=True)
    stored.update(updates)
    return stored


@app.delete("/todos/{todo_id}", status_code=204, summary="Delete a TODO")
def delete_todo(todo_id: int, _=Depends(authenticate)):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="TODO not found")
    del todos[todo_id]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
