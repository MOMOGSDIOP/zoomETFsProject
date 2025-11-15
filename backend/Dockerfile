FROM python:3.9-slim AS builder

WORKDIR /zoom-etf

# Dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    python3-dev \
    g++ \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer toutes les dépendances d'un coup
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --timeout 100 -r requirements.txt


# === final stage ===
FROM python:3.9-slim

WORKDIR /zoom-etf

RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY backend/app backend/app
COPY backend/tests backend/tests
COPY backend/alembic.ini backend/alembic.ini
COPY backend/start.sh backend/start.sh

ENV PYTHONPATH=/zoom-etf/backend
ENV LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

RUN chmod +x backend/start.sh

EXPOSE 8000

CMD ["/zoom-etf/backend/start.sh"]
