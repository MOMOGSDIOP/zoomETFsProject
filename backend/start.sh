#!/usr/bin/env bash
set -e

echo "⏳ Waiting for PostgreSQL at db:5432..."
until nc -z db 5432; do
  sleep 1
done
echo "✅ PostgreSQL is up!"

echo "📦 Applying Alembic migrations..."
if alembic upgrade head; then
  echo "✅ Alembic migrations applied."
else
  echo "⚠️ Alembic failed — falling back to manual table creation with SQLAlchemy."
fi

echo "🔧 Initializing database data (if needed)..."
python backend/app/core/init_db.py
echo "✅ Database initialized."

echo "🚀 Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
