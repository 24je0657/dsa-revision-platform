from pydantic import BaseModel

class Problem(BaseModel):
    slug: str
    title: str
    difficulty: str
    topic: str
    description: str
    hints: list[str]