from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from schemas import Problem
from models import ProblemDB
from database import get_db, Base, engine


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
def get_problems(db: Session = Depends(get_db)):
    return db.query(ProblemDB).all()


@app.get("/problems/{slug}", response_model=Problem)
def get_problem(slug: str, db: Session = Depends(get_db)):
    problem = db.query(ProblemDB).filter(ProblemDB.slug == slug).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return problem


Base.metadata.create_all(bind=engine)


