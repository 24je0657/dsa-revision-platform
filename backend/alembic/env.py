from logging.config import fileConfig

import os
import sys

from sqlalchemy import create_engine
from sqlalchemy import pool

from alembic import context

from dotenv import load_dotenv


# Add project root to Python path
sys.path.append(
    os.path.join(os.path.dirname(__file__), "..")
)


# Load .env
load_dotenv()


# Import models and metadata
from database import Base
import models


# Alembic Config object
config = context.config


# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# Database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")


# SQLAlchemy metadata
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    connectable = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
