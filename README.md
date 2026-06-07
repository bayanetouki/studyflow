# StudyFlow

Application web full-stack de productivité étudiante développée dans le cadre du module **Génie Logiciel 2025-2026**.

## Présentation

StudyFlow centralise les outils essentiels à l'organisation des études :

* Gestion des tâches avec vues quotidienne, hebdomadaire et mensuelle
* Timer Pomodoro avec plusieurs méthodes de travail
* Calendrier interactif
* Collaboration en équipe avec tâches partagées et messagerie
* Tableau de bord de suivi de progression et statistiques

Les données sont stockées dans PostgreSQL et sécurisées par authentification JWT.

## Déploiement

* Frontend : https://studyflow-xagp.vercel.app
* Backend API : https://studyflow-backend-8mxm.onrender.com
* Documentation API : https://studyflow-backend-8mxm.onrender.com/api/v1/auth/register/

## Stack Technique

| Couche           | Technologies                                    |
| ---------------- | ----------------------------------------------- |
| Frontend         | React 18, TypeScript, Vite, TailwindCSS         |
| Backend          | Django 5, Django REST Framework, Python 3.12    |
| Base de données  | PostgreSQL (production), SQLite (développement) |
| Authentification | JWT                                             |
| CI/CD            | GitHub Actions                                  |
| Containerisation | Docker, Docker Compose                          |

## Architecture

L'application suit une architecture client-serveur :

```text
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

## Fonctionnalités

### Authentification

* Inscription et connexion sécurisées
* Gestion du profil utilisateur
* Authentification JWT avec tokens d'accès et de rafraîchissement

### Gestion des tâches

* Création, modification et suppression des tâches
* Priorités et filtrage
* Organisation quotidienne, hebdomadaire et mensuelle

### Pomodoro & Calendrier

* Plusieurs modes Pomodoro
* Sauvegarde des sessions de travail
* Gestion d'événements dans un calendrier interactif

### Collaboration

* Création d'équipes
* Codes d'invitation et QR Codes
* Tâches partagées
* Messagerie entre membres

### Suivi de progression

* Statistiques de productivité
* Historique d'activité
* Graphiques et tableaux de bord

## Tests

Le projet dispose de tests unitaires automatisés avec **pytest** et **pytest-django**.

## Équipe

* Bayane TOUKI
* Oumenia CHOUHBAN
* Chaymae LAHMAMA

**Encadrant : Prof. Fahd Kalloubi**
