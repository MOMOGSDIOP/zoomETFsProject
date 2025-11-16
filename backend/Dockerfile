FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc libpq-dev python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Hostinger copie TOUT le repo, donc on se place au bon niveau
COPY . /app/

# Installer depuis le bon chemin
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Maintenant le chemin est correct
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
