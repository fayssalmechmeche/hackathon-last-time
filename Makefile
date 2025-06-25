# Makefile pour gérer les microservices

# Variables
MICROSERVICES_DIR = microservices
SERVICES = $(shell find $(MICROSERVICES_DIR) -maxdepth 1 -type d -not -path $(MICROSERVICES_DIR) | xargs -I {} basename {})

# Docker Compose pour auth
dcu:
	docker compose -f microservices/auth/compose.yaml up -d

dcd:
	docker compose -f microservices/auth/compose.yaml down

dcdv:
	docker compose -f microservices/auth/compose.yaml down -v

# Commandes pour démarrer tous les microservices
start-all:
	@echo "Démarrage de tous les microservices..."
	@for service in $(SERVICES); do \
		if [ -f $(MICROSERVICES_DIR)/$$service/package.json ]; then \
			echo "Démarrage du service: $$service"; \
			cd $(MICROSERVICES_DIR)/$$service && npm run dev & \
		else \
			echo "Pas de package.json trouvé pour $$service, ignoré"; \
		fi; \
	done
	@echo "Tous les services ont été lancés en arrière-plan"

# Démarrer un service spécifique
start-%:
	@if [ -f $(MICROSERVICES_DIR)/$*/package.json ]; then \
		echo "Démarrage du service: $*"; \
		cd $(MICROSERVICES_DIR)/$* && npm run start; \
	else \
		echo "Service $* non trouvé ou pas de package.json"; \
	fi

# Installer les dépendances pour tous les services
install-all:
	@echo "Installation des dépendances pour tous les microservices..."
	@for service in $(SERVICES); do \
		if [ -f $(MICROSERVICES_DIR)/$$service/package.json ]; then \
			echo "Installation pour: $$service"; \
			cd $(MICROSERVICES_DIR)/$$service && npm install; \
		fi; \
	done

# Installer les dépendances pour un service spécifique
install-%:
	@if [ -f $(MICROSERVICES_DIR)/$*/package.json ]; then \
		echo "Installation des dépendances pour: $*"; \
		cd $(MICROSERVICES_DIR)/$* && npm install; \
	else \
		echo "Service $* non trouvé ou pas de package.json"; \
	fi

# Lister tous les services disponibles
list-services:
	@echo "Services disponibles:"
	@for service in $(SERVICES); do \
		if [ -f $(MICROSERVICES_DIR)/$$service/package.json ]; then \
			echo "  - $$service ✓"; \
		else \
			echo "  - $$service (pas de package.json)"; \
		fi; \
	done

# Arrêter tous les processus Node.js (attention: tue TOUS les processus node)
stop-all:
	@echo "Arrêt de tous les processus Node.js..."
	@pkill -f "node.*start" || echo "Aucun processus Node.js trouvé"

# Nettoyer les node_modules de tous les services
clean-all:
	@echo "Suppression des node_modules..."
	@for service in $(SERVICES); do \
		if [ -d $(MICROSERVICES_DIR)/$$service/node_modules ]; then \
			echo "Nettoyage: $$service"; \
			rm -rf $(MICROSERVICES_DIR)/$$service/node_modules; \
		fi; \
	done

# Aide
help:
	@echo "Commandes disponibles:"
	@echo "  dcu              - Démarrer Docker Compose pour auth"
	@echo "  dcd              - Arrêter Docker Compose pour auth"
	@echo "  dcdv             - Arrêter Docker Compose pour auth (avec volumes)"
	@echo "  start-all        - Démarrer tous les microservices"
	@echo "  start-<service>  - Démarrer un service spécifique"
	@echo "  install-all      - Installer les dépendances pour tous les services"
	@echo "  install-<service>- Installer les dépendances pour un service"
	@echo "  list-services    - Lister tous les services disponibles"
	@echo "  stop-all         - Arrêter tous les processus Node.js"
	@echo "  clean-all        - Supprimer tous les node_modules"
	@echo "  help             - Afficher cette aide"

.PHONY: dcu dcd dcdv start-all install-all list-services stop-all clean-all help