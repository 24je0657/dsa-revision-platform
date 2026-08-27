from database import SessionLocal
from models import SubmissionDB, ProgressDB
from datetime import timedelta

db = SessionLocal()

submissions = (
    db.query(SubmissionDB)
    .order_by(SubmissionDB.submitted_at.desc())
    .all()
)

seen_pairs = set()

for sub in submissions:
    key = (sub.user_id, sub.problem_id)

    # Only process each user-problem pair once.
    # Because submissions are newest-first, this is the latest submission.
    if key in seen_pairs:
        continue

    seen_pairs.add(key)

    existing_progress = (
        db.query(ProgressDB)
        .filter(
            ProgressDB.user_id == sub.user_id,
            ProgressDB.problem_id == sub.problem_id,
        )
        .first()
    )

    if existing_progress:
        continue

    interval = 1

    progress = ProgressDB(
        user_id=sub.user_id,
        problem_id=sub.problem_id,
        last_attempted=sub.submitted_at,
        interval_days=interval,
        next_review_due=sub.submitted_at + timedelta(days=interval),
    )

    db.add(progress)

db.commit()
db.close()

print(f"Backfilled {len(seen_pairs)} user-problem pairs.")