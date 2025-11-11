# PokiFinder - Pokemon Discovery App

A modern, responsive Pokemon discovery application built with Vue.js 3 and Express.js, featuring a beautiful UI with search, filtering, and detailed Pokemon information.

## 🛠️ Tech Stack

### Frontend

1. Vue.js 3 - Progressive JavaScript framework
2. Vue Router - Client-side routing
3. Axios - HTTP client for API calls
4. CSS3 - Custom properties and modern layouts

### Backend

1. Express.js - Web application framework
2. Axios - HTTP client for PokeAPI integration
3. CORS - Cross-origin resource sharing
4. Environment Variables - Secure configuration

### Infrastructure

1. Docker - Containerization
2. Docker Compose - Multi-container orchestration
3. Nginx - Reverse proxy and static file serving

## 📦 Installation

### Docker and Docker Compose

**Before start add .env file in root**
Example:
```env
# Backend Configuration
PORT=3000

# API Security
API_KEY=some_api_key

# PokeAPI Configuration
POKEAPI_BASE_URL=https://pokeapi.co/api/v2

# Frontend Configuration
VITE_APP_BACKEND_URL=http://localhost:${PORT}
```

1. Prod

```bash
docker compose up --build
```

2. Dev

```bash
docker compose -f docker-compose.dev.yml up --build
```

### npm (in root (check package.json))

1. Prod

```bash
npm run prod
```

2. Dev

```bash
npm run dev
```
