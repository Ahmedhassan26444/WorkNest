# WorkNest

WorkNest is a multi-tenant SaaS project management dashboard. Each organization gets its own isolated workspace — projects, tasks, team members, and analytics are all scoped so one organization can never see or touch another's data.

Built as a MERN-stack project (MongoDB, Express, React, Node.js) with JWT authentication, role-based access control, and email-driven onboarding.

## Features

### Multi-tenant architecture

Every project, task, and notification is scoped to an organization and enforced at the query level in every controller.

### Authentication

Register + login with JWT

Email verification (required before login)

Change password

Delete account with safe cleanup of related data

Role-based access control — owner, manager, and employee roles with different permissions across projects, tasks, and team management

### Team management

Invite members by email using a token-based invitation flow

Remove members without orphaning their work — their tasks are unassigned, not deleted

### Projects & Tasks

Full CRUD

Status tracking

Task assignment

Due dates

Priority levels

### Dashboard & Analytics

Organization-wide statistics

Analytics scoped per tenant

### Notifications

In-app notifications tied to project and task activity

### Profile management

Profile photo upload and delete

Name updates

## Tech Stack

### Backend

Node.js + Express 5

MongoDB + Mongoose

JWT (jsonwebtoken)

bcrypt for password hashing

multer for file uploads

nodemailer (Gmail) for email services

### Frontend

React 19 + Vite

React Router 7

Tailwind CSS 4

Axios / Fetch API

## Core Flow

Register → creates a User (owner) + a new Organization and sends a verification email.

Verify email → click the verification link to activate the account.

Login → issues a JWT (30-day expiry) used as a Bearer token on protected requests.

Invite teammates → owner/manager sends invitations by email; invitees register and join the same organization.

Work → create projects, add tasks, assign them to members, and track task status.

## Security

JWT-based authentication

Passwords securely hashed with bcrypt

Email verification before login

Role-based authorization middleware

Organization-scoped database queries

Protected API routes

Tenant isolation between organizations

## Roadmap

Auth (register, login, email verification)

Team invitations

Role-based permissions

## Project Structure

```text
WorkNest/
├── Backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authController.js      # Register, login, verification, password reset
│   │   │   ├── authRoutes.js          # Auth API routes
│   │   │   └── ...
│   │   │
│   │   ├── organization/
│   │   │   ├── organizationController.js
│   │   │   ├── organizationRoutes.js
│   │   │   └── ...
│   │   │
│   │   ├── project/                   # Project CRUD
│   │   ├── task/                      # Task CRUD
│   │   ├── dashboard/                 # Dashboard statistics
│   │   ├── analytics/                 # Analytics statistics
│   │   └── notification/              # Notifications
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT authentication
│   │   ├── roleMiddleware.js           # Role-based access control
│   │   └── uploadMiddleware.js         # Multer profile photo upload
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Organization.js
│   │   ├── Notification.js
│   │   └── Invitation.js
│   │
│   ├── utils/
│   │   ├── emailService.js             # Nodemailer email service
│   │   └── validatePassword.js         # Password strength validation
│   │
│   ├── uploads/                         # Uploaded profile photos
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Team.jsx
    │   │   ├── Analytics.jsx
    │   │   └── ...
    │   │
    │   ├── services/
    │   │   ├── authApi.js
    │   │   ├── projectApi.js
    │   │   ├── taskApi.js
    │   │   ├── teamApi.js
    │   │   └── ...
    │   │
    │   ├── config/
    │   │   └── api.js                  # Centralized API base URL
    │   │
    │   ├── components/                 # Reusable UI components
    │   ├── App.jsx                     # Application routes
    │   └── main.jsx
    │
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## Environment Variables

Create a `.env` file inside the `Backend` directory.

```env
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
```

See `.env.example` for the required environment variables.

Never commit real environment variables or secrets to the repository.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Backend Setup

```bash
cd Backend
npm install
npm run dev
```
