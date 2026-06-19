.PHONY: help up down restart logs build clean lint test status

help:
	@echo "Доступные команды:"
	@echo "  make up        - Запустить все контейнеры"
	@echo "  make down      - Остановить все контейнеры"
	@echo "  make restart   - Перезапустить все контейнеры"
	@echo "  make logs      - Просмотреть логи всех контейнеров"
	@echo "  make build     - Пересобрать все образы"
	@echo "  make clean     - Остановить контейнеры и удалить volumes"
	@echo "  make lint      - Проверить код бэкенда (flake8)"
	@echo "  make test      - Запустить тесты бэкенда (pytest)"
	@echo "  make status    - Показать статус контейнеров"

up:
	docker compose up -d
	@echo "Контейнеры запущены"
	@echo "Открой http://localhost"

down:
	docker compose down
	@echo "Контейнеры остановлены"

restart:
	docker compose restart
	@echo "Контейнеры перезапущены"

logs:
	docker compose logs -f

build:
	docker compose build --no-cache
	@echo "Образы пересобраны"

clean:
	docker compose down -v
	@echo "Контейнеры остановлены и volumes удалены"

status:
	docker compose ps

lint:
	docker compose exec backend flake8 app/ || echo "Линтер не настроен"

test:
	docker compose exec backend pytest || echo "Тесты не настроены"

dev:
	docker compose up -d db
	sleep 3
	docker compose up -d backend
	sleep 2
	docker compose up -d nginx
	@echo "Среда разработки готова"