# Mood Tracker

Mood Tracker is a simple full-stack application for logging moods. It was developed in one night as a personal challenge.

## Features

- Log moods and view past entries
-	SQLite database for persistence
-	Backend: Express + TypeScript
-	Frontend: React (Vite) + TypeScript
-	Dockerized for easy deployment
-	CI/CD with GitHub Actions

## Setup & Running the Application

### 1. Clone the Repository

```
git clone https://github.com/szidanne/mood-tracker.git
```

### 2. Configure Environment Variables

#### Backend (backend/.env)

```
PORT=8000
DB_PATH=/app/database.sqlite
```

#### Frontend (frontend/.env)

```
VITE_API_URL=http://backend:8000
```

### 3. Run the Application with Docker

```
docker-compose up --build
```

This will start:
- Backend at `http://localhost:8000`
- Frontend at `http://localhost:3000`

## Project Structure

```
mood-logger/
│── backend/       # Express API with SQLite
│── frontend/      # React (Vite) UI
│── .github/       # GitHub Actions CI/CD
│── docker-compose.yml
│── README.md
```

## Final Notes

This project was built in one night as a challenge to learn backend development, Docker, and GitHub Actions. It is not perfect, but it works.
