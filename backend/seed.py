from database import SessionLocal
from models import ProblemDB
from data import problems  # your existing hardcoded Pydantic Problem list

db = SessionLocal()

for problem in problems:
    db_problem = ProblemDB(
        slug=problem["slug"],
        title=problem["title"],
        difficulty=problem["difficulty"],
        topic=problem["topic"],
        description=problem["description"],
        hints=problem["hints"],
    )
    db.add(db_problem)

db.commit()
db.close()
print("Database seeded successfully.")