TaskFlow — DevOps Todo Platform

Демонстрационный проект для портфолио Junior DevOps Engineer.

Технологический стек

- Backend: Python + FastAPI
- Frontend: HTML + Tailwind CSS + Vanilla JS
- Database: PostgreSQL
- Cache: Redis (опционально)
- Reverse Proxy: Nginx
- Контейнеризация: Docker + Docker Compose
- CI/CD: GitHub Actions
- Регистрация образов: GitHub Container Registry (GHCR)

Функциональность

- Регистрация и аутентификация пользователей (JWT)
- CRUD операции с задачами
- Фильтрация задач по статусу (To Do / In Progress / Done)
- Дедлайны задач

Структура проекта

TaskFlow/
├── app/                      # Backend (FastAPI)
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── database.py
│   ├── auth.py
│   ├── dependencies.py
│   └── requirements.txt
├── frontend/                 # Статические файлы
│   ├── index.html
│   ├── login.html
│   ├── tasks.html
│   └── static/
│       ├── css/
│       │   └── style.css
│       └── js/
│           ├── config.js
│           ├── auth.js
│           ├── tasks.js
│           ├── ui.js
│           ├── index.js
│           ├── login.js
│           └── tasks-app.js
├── nginx/                    # Конфигурация Nginx
│   └── nginx.conf
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── Makefile
└── README.md

Быстрый старт

Локальная разработка

1. Склонируйте репозиторий:
git clone https://github.com/yourusername/taskflow.git
cd taskflow

2. Создайте файл .env на основе .env.example

3. Запустите приложение через Docker Compose:
docker-compose up -d

4. Откройте в браузере: http://localhost

Проверка статуса

docker-compose ps
curl http://localhost/api/health

API Endpoints

Метод    Эндпоинт                 Описание
POST     /api/auth/register       Регистрация
POST     /api/auth/login          Вход (JWT)
GET      /api/auth/me             Текущий пользователь
GET      /api/tasks               Список задач
POST     /api/tasks               Создать задачу
GET      /api/tasks/{id}          Получить задачу
PUT      /api/tasks/{id}          Обновить задачу
DELETE   /api/tasks/{id}          Удалить задачу
GET      /api/health              Health check

Документация API доступна по адресу: /docs

CI/CD

Проект использует GitHub Actions для:

- Линтинга кода
- Запуска тестов
- Сборки Docker-образа
- Публикации образа в GHCR

Makefile команды

make up       Запустить контейнеры
make down     Остановить контейнеры
make logs     Просмотр логов
make build    Собрать образы
make test     Запустить тесты
make lint     Проверить код

Развертывание на сервере

git clone https://github.com/Undruuu/taskflow.git
cd taskflow
cp .env.example .env
# Отредактируйте .env с реальными значениями
docker-compose up -d
