# backend/app/tests/db/test_migrations.py

import subprocess
import os
import pytest

ALEMBIC_CONFIG = os.path.join(os.path.dirname(__file__), "../../../alembic.ini")

def test_alembic_upgrade_head():
    """Teste que alembic upgrade head s'exécute sans erreur"""
    result = subprocess.run(
        ["alembic", "-c", ALEMBIC_CONFIG, "upgrade", "head"],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    print(result.stderr)
    assert result.returncode == 0, f"Alembic failed: {result.stderr}"
