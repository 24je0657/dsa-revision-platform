from fastapi import FastAPI
from data import problems
from models import Problem

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "DSA Revision Platform API is running"}

@app.get("/problems", response_model=list[Problem])
def get_problems():
    return problems