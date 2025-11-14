#!/bin/bash
docker exec zoometf-postgres psql -U zoomuser -d zoometf -c "SELECT * FROM users LIMIT 1;"
echo "Vérification terminée - si pas d'erreur, les tables sont correctement créées"