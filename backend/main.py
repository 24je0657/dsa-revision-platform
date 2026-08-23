from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data import problems
from models import Problem

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "DSA Revision Platform API is running"}


@app.get("/problems", response_model=list[Problem])
def get_problems():
    return problems