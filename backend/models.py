from sqlalchemy import Column, Integer, String, ARRAY
from database import Base


class ProblemDB(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String)
    difficulty = Column(String)
    topic = Column(String)
    description = Column(String)
    hints = Column(ARRAY(String))