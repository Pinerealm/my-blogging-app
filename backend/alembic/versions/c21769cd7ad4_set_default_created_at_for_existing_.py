"""set_default_created_at_for_existing_users

Revision ID: c21769cd7ad4
Revises: 4f98ed2a0250
Create Date: 2025-09-24 09:30:38.324244

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c21769cd7ad4"
down_revision: Union[str, Sequence[str], None] = "bbd9da9d01fa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Set created_at to current timestamp for existing users."""
    # Update existing users with null created_at to current timestamp
    op.execute(
        """
        UPDATE "user" 
        SET created_at = CURRENT_TIMESTAMP 
        WHERE created_at IS NULL
    """
    )


def downgrade() -> None:
    """Downgrade schema."""
    # No need to revert the data fix
    pass
