from sqlalchemy import Column, Integer, String, Text, ARRAY, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from database import Base
from sqlalchemy import Float

class ProblemDB(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String)
    difficulty = Column(String)
    topic = Column(String)
    description = Column(String)
    hints = Column(ARRAY(String))
    leetcode_url = Column(String, nullable=True, index=True)


class SubmissionDB(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    code = Column(Text)
    language = Column(String)
    verdict = Column(String)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class ProgressDB(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)

    last_attempted = Column(DateTime(timezone=True))
    next_review_due = Column(DateTime(timezone=True))
    interval_days = Column(Integer, default=1, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "problem_id",
            name="uq_progress_user_problem"
        ),
    )

class UserProblemDB(Base):
    __tablename__ = "user_problems"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "problem_id",
            name="uq_user_problems_user_problem",
        ),
    )