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

# COPIER LE START.SH EN PREMIER
COPY backend/start.sh /zoom-etf/backend/start.sh
RUN chmod +x /zoom-etf/backend/start.sh

# Puis copier le reste
COPY backend/ /zoom-etf/backend/

ENV PYTHONPATH=/zoom-etf/backend
ENV LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

EXPOSE 8000

CMD ["/zoom-etf/backend/start.sh"]
