# VARIABLES
COMPOSE = docker-compose
PROJECT_NAME = zoometf
COMPOSE_FILE = docker-compose.yml

# INITIALISATION
init: pull-models init-db init-es wait-healthy
	@echo "✅ Tous les services sont initialisés"

pull-models:
	@echo "📥 Téléchargement du modèle Llama3..."
	$(COMPOSE) up ollama_init

init-db:
	@echo "🗃️  Initialisation de la base de données..."
	$(COMPOSE) exec backend python -m app.core.init_db

init-es:
	@echo "🔍 Initialisation d'Elasticsearch..."
	$(COMPOSE) exec backend python -m app.core.init_elasticsearch

wait-healthy:
	@echo "⏳ Attente que tous les services soient healthy..."
	@until $(COMPOSE) ps | grep -E "(backend|elasticsearch|redis|db|ollama)" | grep -v "healthy" | wc -l | grep -q "0"; do \
		echo "En attente des services..."; \
		sleep 10; \
	done
	@echo "✅ Tous les services sont healthy"

# BUILD GLOBAL
build: build-backend build-frontend build-docs

rebuild: clean build

# LIFECYCLE
up:
	COMPOSE_HTTP_TIMEOUT=300 $(COMPOSE) -p $(PROJECT_NAME) up --build -d

down:
	$(COMPOSE) -p $(PROJECT_NAME) down

restart: down up

logs:
	$(COMPOSE) -p $(PROJECT_NAME) logs -f

logs-backend:
	$(COMPOSE) -p $(PROJECT_NAME) logs -f backend

logs-ollama:
	$(COMPOSE) -p $(PROJECT_NAME) logs -f ollama

ps:
	$(COMPOSE) -p $(PROJECT_NAME) ps

# BACKEND
build-backend:
	docker build -t $(PROJECT_NAME)-backend -f backend/Dockerfile .

test-backend:
	$(COMPOSE) -p $(PROJECT_NAME) exec backend pytest

shell-backend:
	$(COMPOSE) -p $(PROJECT_NAME) exec backend bash

test: test-backend

# FRONTEND
build-frontend:
	docker build -t $(PROJECT_NAME)-frontend -f frontend/Dockerfile .

dev-frontend:
	cd frontend && npm start

# DOCS STATIQUES
build-docs:
	mkdir -p docs/site
	docker run --rm -v ${PWD}/docs:/data pandoc/core \
		--standalone -f markdown -o site/index.html

# CLEAN
clean:
	docker system prune -f 
	$(COMPOSE) -p $(PROJECT_NAME) down -v --remove-orphans

clean-volumes:
	$(COMPOSE) -p $(PROJECT_NAME) down -v --remove-orphans
	docker volume rm $(shell docker volume ls -q | grep $(PROJECT_NAME)) 2>/dev/null || true

# MONITORING
monitoring:
	xdg-open http://localhost:9090 || open http://localhost:9090

grafana:
	xdg-open http://localhost:3000 || open http://localhost:3000

pgadmin:
	xdg-open http://localhost:5050 || open http://localhost:5050

frontend:
	xdg-open http://localhost:3001 || open http://localhost:3001

# DIAGNOSTIC
status:
	@echo "=== Status des services ==="
	$(COMPOSE) -p $(PROJECT_NAME) ps
	@echo ""
	@echo "=== Logs récents backend ==="
	$(COMPOSE) -p $(PROJECT_NAME) logs backend --tail=20
	@echo ""
	@echo "=== Logs récents Ollama ==="
	$(COMPOSE) -p $(PROJECT_NAME) logs ollama --tail=10

health-check:
	@echo "🔍 Vérification de la santé des services..."
	@curl -f http://localhost:8000/health >/dev/null 2>&1 && echo "✅ Backend: Healthy" || echo "❌ Backend: Unhealthy"
	@curl -f http://localhost:9200 >/dev/null 2>&1 && echo "✅ Elasticsearch: Healthy" || echo "❌ Elasticsearch: Unhealthy"
	@curl -f http://localhost:11435/api/tags >/dev/null 2>&1 && echo "✅ Ollama: Healthy" || echo "❌ Ollama: Unhealthy"

# DÉPLOIEMENT RAPIDE
quick-start: pull-models up wait-healthy init-db init-es
	@echo "🚀 ZoomETF est prêt!"
	@echo "Frontend: http://localhost:3001"
	@echo "Backend API: http://localhost:8000"
	@echo "PgAdmin: http://localhost:5050"