from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import random

from schemas import Problem, SubmissionCreate, SubmissionResult
from models import ProblemDB, SubmissionDB
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
@app.post("/submissions", response_model=SubmissionResult)
def create_submission(
    submission: SubmissionCreate,
    db: Session = Depends(get_db)
):
    problem = db.query(ProblemDB).filter(
        ProblemDB.id == submission.problem_id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    verdict = random.choice(["Accepted", "Wrong Answer"])

    db_submission = SubmissionDB(
        problem_id=submission.problem_id,
        code=submission.code,
        language=submission.language,
        verdict=verdict,
    )

    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)

    return db_submission
@app.get("/problems/{slug}/submissions", response_model=list[SubmissionResult])
def get_submissions_for_problem(
    slug: str,
    db: Session = Depends(get_db)
):
    problem = db.query(ProblemDB).filter(ProblemDB.slug == slug).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return (
        db.query(SubmissionDB)
        .filter(SubmissionDB.problem_id == problem.id)
        .order_by(SubmissionDB.submitted_at.desc())
        .all()
    )

