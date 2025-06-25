dcu:
	docker compose -f microservices/auth/compose.yaml up -d

dcd:
	docker compose -f microservices/auth/compose.yaml down

dcdv:
	docker compose -f microservices/auth/compose.yaml down -v
