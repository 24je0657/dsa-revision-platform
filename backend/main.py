from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import random

from schemas import Problem, SubmissionCreate, SubmissionResult
from models import ProblemDB, SubmissionDB
from database import get_db, Base, engine

from schemas import UserCreate, UserResponse, Token,DueReview
from models import UserDB
from auth import hash_password, verify_password, create_access_token

from auth import get_current_user, get_current_user_optional
from datetime import datetime, timezone, timedelta
from models import ProgressDB
from schemas import ProblemWithProgress
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm


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



@app.get("/problems", response_model=list[ProblemWithProgress])
def get_problems(
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_optional),
):
    problems = db.query(ProblemDB).all()

    progress_map = {}
    if current_user:
        progress_rows = (
            db.query(ProgressDB)
            .filter(ProgressDB.user_id == current_user.id)
            .all()
        )
        progress_map = {p.problem_id: p for p in progress_rows}

    result = []
    for problem in problems:
        progress = progress_map.get(problem.id)
        result.append({
            "id": problem.id,
            "slug": problem.slug,
            "title": problem.title,
            "difficulty": problem.difficulty,
            "topic": problem.topic,
            "description": problem.description,
            "hints": problem.hints,
            "next_review_due": progress.next_review_due if progress else None,
            "interval_days": progress.interval_days if progress else None,
        })
    return result


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

def update_progress(db: Session, user_id: int, problem_id: int, verdict: str):
    progress = (
        db.query(ProgressDB)
        .filter(ProgressDB.user_id == user_id, ProgressDB.problem_id == problem_id)
        .first()
    )

    now = datetime.now(timezone.utc)

    if progress is None:
        interval = 1
        progress = ProgressDB(
            user_id=user_id,
            problem_id=problem_id,
            last_attempted=now,
            interval_days=interval,
            next_review_due=now + timedelta(days=interval),
        )
        db.add(progress)
    else:
        if verdict == "Accepted":
            progress.interval_days = progress.interval_days * 2
        else:
            progress.interval_days = 1

        progress.last_attempted = now
        progress.next_review_due = now + timedelta(days=progress.interval_days)

    db.commit()
@app.post("/submissions", response_model=SubmissionResult)
def create_submission(
    submission: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user),
):
    problem = (
        db.query(ProblemDB)
        .filter(ProblemDB.id == submission.problem_id)
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    verdict = random.choice(["Accepted", "Wrong Answer"])

    db_submission = SubmissionDB(
        problem_id=submission.problem_id,
        user_id=current_user.id,
        code=submission.code,
        language=submission.language,
        verdict=verdict,
    )

    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    update_progress(
        db,
        current_user.id,
        submission.problem_id,
        verdict,
    )

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



@app.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = UserDB(
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
@app.post("/login", response_model=Token)
def login(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    db_user = (
        db.query(UserDB)
        .filter(UserDB.email == user.email)
        .first()
    )

    if not db_user or not verify_password(
        user.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    token = create_access_token({
        "sub": db_user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/reviews/due", response_model=list[DueReview])
def get_due_reviews(
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)

    due_reviews = (
        db.query(ProgressDB, ProblemDB)
        .join(
            ProblemDB,
            ProgressDB.problem_id == ProblemDB.id,
        )
        .filter(
            ProgressDB.user_id == current_user.id,
            ProgressDB.next_review_due <= now,
        )
        .all()
    )

    return [
        {
            "problem": problem,
            "next_review_due": progress.next_review_due,
            "interval_days": progress.interval_days,
        }
        for progress, problem in due_reviews
    ]