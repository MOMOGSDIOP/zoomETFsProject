FROM python:3.9-slim

WORKDIR /zoom-etf

RUN apt-get update && apt-get install -y \
    gcc libpq-dev python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier le backend dans zoom-etf/backend (comme vos imports l'attendent)
COPY backend/ /zoom-etf/backend/

# Installer les dépendances
RUN pip install --no-cache-dir -r /zoom-etf/backend/requirements.txt

ENV PYTHONPATH=/zoom-etf
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Commande avec le chemin que vos imports attendent
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
