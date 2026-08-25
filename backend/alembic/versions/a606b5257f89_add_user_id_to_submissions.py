"""add user_id to submissions

Revision ID: a606b5257f89
Revises: e31bb357e116
Create Date: 2026-08-25 12:02:17.958081
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a606b5257f89"
down_revision: Union[str, Sequence[str], None] = "e31bb357e116"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add user_id temporarily as nullable because existing
    # submissions do not have an associated user yet.
    op.add_column(
        "submissions",
        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=True
        )
    )

    # Connect submissions.user_id to users.id.
    op.create_foreign_key(
        "submissions_user_id_fkey",
        "submissions",
        "users",
        ["user_id"],
        ["id"]
    )

    # Assign existing submissions to the existing development user.
    op.execute(
        "UPDATE submissions SET user_id = 1 WHERE user_id IS NULL"
    )

    # From this point forward every submission must belong to a user.
    op.alter_column(
        "submissions",
        "user_id",
        existing_type=sa.Integer(),
        nullable=False
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "submissions_user_id_fkey",
        "submissions",
        type_="foreignkey"
    )

    op.drop_column(
        "submissions",
        "user_id"
    )
