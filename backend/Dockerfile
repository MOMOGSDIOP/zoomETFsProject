FROM python:3.9-slim

WORKDIR /zoom-etf

# Dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    python3-dev \
    g++ \
    libopenblas-dev \
    netcat-openbsd \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --timeout 100 -r requirements.txt

# Copier le code de l'application
COPY backend/ /zoom-etf/backend/

ENV PYTHONPATH=/zoom-etf/backend
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# TOUT EST ICI - PAS DE SCRIPT EXTERNE
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
