#!/bin/sh

python -m alembic upgrade head
python seed.py

exec uvicorn main:app --host 0.0.0.0 --port 8000