from sqlalchemy import Column, Integer, String, ARRAY, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base
from sqlalchemy import Column, Integer, String, Text, ARRAY, ForeignKey, DateTime


class ProblemDB(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String)
    difficulty = Column(String)
    topic = Column(String)
    description = Column(String)
    hints = Column(ARRAY(String))


class SubmissionDB(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    code = Column(Text)
    language = Column(String)
    verdict = Column(String)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())