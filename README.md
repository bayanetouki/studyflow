# StudyFlow

Application web de productivité étudiante développée dans le cadre du PFA — Module Génie Logiciel 2025-2026.

## Présentation

StudyFlow aide les étudiants à organiser leur travail au quotidien. L'application regroupe la gestion des tâches, un timer Pomodoro, un calendrier, un espace de collaboration en équipe et un suivi de progression. Toutes les données sont persistées en base de données et accessibles depuis n'importe quel appareil.

L'application est disponible en ligne :
- Frontend : https://studyflow-xagp.vercel.app
- Backend API : https://studyflow-backend-8mxm.onrender.com

## Stack technique

**Frontend** : React, TypeScript, Vite, TailwindCSS  
**Backend** : Django REST Framework, Python 3.12  
**Base de données** : PostgreSQL (production), SQLite (développement)  
**Authentification** : JWT via djangorestframework-simplejwt  
**CI/CD** : GitHub Actions  
**Déploiement** : Render (backend), Vercel (frontend)  
**Containerisation** : Docker, Docker Compose  

## Lancer le projet en local

### Prérequis

- Python 3.12+
- Node.js 18+
- Git

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

L'API est accessible sur http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur http://localhost:5173

### Variables d'environnement

Copier `.env.example` en `.env` dans le dossier backend et renseigner les valeurs :

```
SECRET_KEY=votre-cle-secrete
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Avec Docker

```bash
docker-compose up --build
```

Lance le backend et PostgreSQL ensemble.

## Tests

```bash
cd backend
pytest tests/ -v
```

34 tests unitaires couvrant l'authentification, les tâches et la collaboration. Taux de couverture supérieur à 70%.

## CI/CD

Le pipeline GitHub Actions se déclenche à chaque push sur `main` ou `develop` et à chaque Pull Request. Il exécute quatre jobs dans l'ordre : tests unitaires, vérification de la qualité du code (flake8), build Docker, puis notification de déploiement sur la branche principale.

## Structure du projet

```
studyflow/
├── backend/
│   ├── apps/
│   │   ├── authentication/
│   │   ├── tasks/
│   │   ├── collaboration/
│   │   └── progress/
│   ├── studyflow/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api/
│       └── app/components/
└── .github/
    └── workflows/
        └── ci-cd.yml
```

## Équipe

Bayane TOUKI — Backend (auth, tâches), tests, déploiement Render  
Oumenia CHOUHBAN — Backend (collaboration, progression), intégration frontend  
Chaymae LAHMAM — CI/CD GitHub Actions, Docker, déploiement Vercel  

Encadrant : Prof. Fahd Kalloubi
