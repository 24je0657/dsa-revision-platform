from datetime import datetime

from pydantic import BaseModel


class Problem(BaseModel):
    id: int
    slug: str
    title: str
    difficulty: str
    topic: str
    description: str
    hints: list[str]

    class Config:
        from_attributes = True


class SubmissionCreate(BaseModel):
    problem_id: int
    code: str
    language: str


class SubmissionResult(BaseModel):
    id: int
    problem_id: int
    code: str
    language: str
    verdict: str
    submitted_at: datetime