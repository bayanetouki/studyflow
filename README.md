# StudyFlow

Application web full-stack de productivité étudiante — Module Génie Logiciel 2025-2026.

## Présentation

StudyFlow centralise tous les outils dont un étudiant a besoin : gestion des tâches avec planification quotidienne, hebdomadaire et mensuelle, timer Pomodoro avec plusieurs méthodes de travail, calendrier interactif, collaboration en équipe avec messagerie et tâches partagées, et suivi de progression avec graphiques. Toutes les données sont stockées en base de données PostgreSQL et sécurisées par authentification JWT.

**Application en production :**

- Frontend : https://studyflow-xagp.vercel.app
- Backend API : https://studyflow-backend-8mxm.onrender.com
- Documentation API : https://studyflow-backend-8mxm.onrender.com/api/v1/auth/register/

## Stack technique

| Couche           | Technologie                                  | Déploiement |
| ---------------- | -------------------------------------------- | ----------- |
| Frontend         | React 18, TypeScript, Vite, TailwindCSS      | Vercel      |
| Backend          | Django 5, Django REST Framework, Python 3.12 | Render      |
| Base de données  | PostgreSQL (prod), SQLite (dev)              | Render      |
| Authentification | JWT (djangorestframework-simplejwt)          | —           |
| CI/CD            | GitHub Actions (4 jobs)                      | GitHub      |
| Containerisation | Docker, Docker Compose                       | —           |

## Architecture

L'application suit une architecture client-serveur à trois niveaux. Le frontend React communique avec le backend Django via une API REST sécurisée par JWT. Le backend accède à une base PostgreSQL hébergée sur Render.

```
Frontend React (Vercel)
        |
        | HTTPS + JWT
        |
Backend Django REST (Render)
        |
        | ORM
        |
PostgreSQL (Render)
```

Le backend est organisé en quatre applications Django indépendantes :

- `authentication` : inscription, connexion, profil utilisateur
- `tasks` : tâches, sessions Pomodoro, événements calendrier
- `collaboration` : équipes, tâches partagées, messagerie
- `progress` : statistiques et suivi de progression

## Design Patterns

Le projet applique sept design patterns du Génie Logiciel :

| Pattern         | Catégorie      | Application dans le code                                                       |
| --------------- | -------------- | ------------------------------------------------------------------------------ |
| Factory Method  | Créationnel    | `User.objects.create_user()` — création sécurisée avec hachage du mot de passe |
| Builder         | Créationnel    | `RefreshToken.for_user(user)` — construction des tokens JWT complexes          |
| Adapter         | Structurel     | Serializers DRF — traduction bidirectionnelle objets Python vers JSON          |
| Facade          | Structurel     | Views API — interface simple qui cache auth, validation, pagination            |
| Template Method | Comportemental | Generic Views DRF — squelette défini, `get_queryset()` surchargé               |
| Strategy        | Comportemental | `permission_classes`, `filter_backends` — comportements interchangeables       |
| Repository      | Architectural  | ORM Django — abstraction complète de l'accès aux données                       |

## API REST — Endpoints

Toutes les routes sont protégées par JWT sauf `/register/` et `/login/`.

```
/api/v1/auth/
    POST   /register/           Créer un compte
    POST   /login/              Connexion, retourne access + refresh tokens
    POST   /logout/             Déconnexion, blacklist du token
    GET    /profile/            Voir son profil
    POST   /token/refresh/      Renouveler le token d'accès

/api/v1/tasks/
    GET    /                    Lister ses tâches (filtres : priority, completed, view_mode)
    POST   /                    Créer une tâche
    GET    /<id>/               Détail d'une tâche
    PUT    /<id>/               Modifier une tâche
    DELETE /<id>/               Supprimer une tâche
    PATCH  /<id>/toggle/        Cocher ou décocher une tâche
    GET    /stats/              Statistiques de productivité
    GET    /pomodoro/           Lister les sessions Pomodoro
    POST   /pomodoro/           Créer une session
    GET    /calendar/           Événements du calendrier
    POST   /calendar/           Créer un événement

/api/v1/collaboration/
    GET    /teams/              Mes équipes
    POST   /teams/              Créer une équipe
    POST   /teams/join/         Rejoindre avec un code d'invitation
    GET    /tasks/              Tâches partagées
    POST   /tasks/              Créer une tâche partagée
    PATCH  /tasks/<id>/progress/ Mettre à jour la progression
    GET    /messages/           Messages d'équipe
    POST   /messages/           Envoyer un message

/api/v1/progress/
    GET    /summary/            Résumé statistiques (global, semaine, mois)
    GET    /daily/              Historique quotidien sur 30 jours
```

## Tests unitaires

34 tests unitaires développés avec pytest et pytest-django. Taux de couverture supérieur à 70%.

```bash
cd backend
pytest tests/ -v
coverage run -m pytest tests/
coverage report
```

| Fichier                | Tests | Ce qui est testé                                          |
| ---------------------- | ----- | --------------------------------------------------------- |
| test_authentication.py | 12    | Inscription, connexion, profil, sécurité des endpoints    |
| test_tasks.py          | 12    | CRUD, isolation entre utilisateurs, filtres, statistiques |
| test_collaboration.py  | 10    | Équipes, codes d'invitation, progression, validation      |

## CI/CD — GitHub Actions

Le pipeline se déclenche à chaque push sur `main` ou `develop` et à chaque Pull Request.

```
Push / Pull Request
        |
        |-- Job 1 : Tests unitaires (PostgreSQL de test, pytest, coverage)
        |-- Job 2 : Qualité du code (flake8)
        |-- Job 3 : Build Docker (validation de l'image)
        |-- Job 4 : Deploy Notification (sur main uniquement)
```

Si un job échoue, le merge est bloqué. Cela garantit qu'aucun code défaillant n'atteint la branche principale.

## Workflow Git

Le projet suit le modèle Gitflow :

```
main          Production — protégée, merge via PR uniquement
develop       Intégration — toutes les features convergent ici
feature/*     Une branche par fonctionnalité
```

Branches créées durant le développement :

| Branche                       | Contenu                                         |
| ----------------------------- | ----------------------------------------------- |
| feature/auth-backend          | App authentication, tests auth                  |
| feature/tasks-backend         | App tasks, tests tasks                          |
| feature/collaboration-backend | Apps collaboration et progress, tests           |
| feature/frontend-integration  | Connexion frontend-backend, tous les composants |
| feature/cicd-pipeline         | GitHub Actions, Docker                          |

Chaque branche a été mergée dans `develop` via une Pull Request avec revue de code, avant le merge final dans `main`.

## Lancer le projet en local

### Prérequis

- Python 3.12+
- Node.js 18+
- Git

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # Renseigner les variables
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API disponible sur http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur http://localhost:5173

### Avec Docker

```bash
docker-compose up --build
```

Lance le backend Django et PostgreSQL ensemble.

### Variables d'environnement

```
SECRET_KEY=*
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Structure du projet

```
studyflow/
├── backend/
│   ├── apps/
│   │   ├── authentication/    # Modèle User, JWT, vues auth
│   │   ├── tasks/             # Tâches, Pomodoro, Calendrier
│   │   ├── collaboration/     # Équipes, tâches partagées, messages
│   │   └── progress/          # Statistiques et suivi
│   ├── studyflow/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── tests/
│   │   ├── test_authentication.py
│   │   ├── test_tasks.py
│   │   └── test_collaboration.py
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api/
│       │   └── client.ts      # Couche d'accès à l'API backend
│       └── app/components/    # Login, Dashboard, Tasks, Calendar...
└── .github/
    └── workflows/
        └── ci-cd.yml          # Pipeline CI/CD
```

## Fonctionnalités

- Authentification sécurisée par JWT avec tokens d'accès et de rafraîchissement
- Gestion des tâches avec priorités, filtrage et vue quotidienne/hebdomadaire/mensuelle
- Timer Pomodoro avec quatre méthodes (25/5, 90/25, 52/17, personnalisé) et sauvegarde des sessions
- Calendrier interactif avec ajout d'événements persistants
- Collaboration en équipe avec codes d'invitation, QR Code, tâches partagées et messagerie
- Tableau de bord avec statistiques réelles et graphiques dynamiques
- Analyse IA de l'emploi du temps (implémentée, nécessite une clé API Anthropic pour activation)

## Équipe

Membre
Bayane TOUKI |
Oumenia CHOUHBAN | 
Chaymae LAHMAMA | 

Encadrant : Prof. Fahd Kalloubi
