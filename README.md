WorkNest
WorkNest is a multi tenant SaaS project management dashboard. Each organization gets its own isolated workspace. Projects, tasks, team members, notifications, and analytics are scoped to the organization so one organization cannot access or modify another organization's data.
Built with the MERN stack using MongoDB, Express, React, and Node.js, with JWT authentication, role based access control, and email driven onboarding.

Features
Multi Tenant Architecture
Every project, task, notification, and team member is scoped to an organization and protected through organization level queries in the backend controllers.

Authentication
Register and login with JWT
Email verification required before login
Change password
Delete account with safe cleanup of related data
Role based access control with owner, manager, and employee roles

Team Management

Invite members by email using a token based invitation flow
Remove members without deleting their assigned work
Tasks belonging to removed members are automatically unassigned instead of being deleted


Projects and Tasks

Create, read, update, and delete projects
Create, read, update, and delete tasks
Task status tracking
Task assignment
Due dates
Priority levels


Dashboard and Analytics

Organization wide dashboard statistics
Organization scoped analytics

Notifications
In app notifications for project and task activity
Notifications are scoped to the user's organization

Profile Management
Update profile name
Upload profile photo
Delete profile photo
Change password

Tech Stack

Backend
Node.js
Express 5
MongoDB
Mongoose
JWT using jsonwebtoken
bcrypt
Multer for profile photo uploads
Nodemailer with Gmail for email services

Frontend
React 19
Vite
React Router 7
Tailwind CSS 4
Axios and Fetch API

Core Flow
Register creates a User and a new Organization.
The organization creator becomes the owner.
A verification email is sent to the registered email address.
Verify the email to activate the account.
Login issues a JWT with a 30 day expiry.
The JWT is sent as a Bearer token with protected API requests.
The owner or manager can invite teammates through email.
Invited users join the same organization through the invitation flow.
Organization members can create and manage projects and tasks according to their assigned role.

Security
JWT based authentication
Passwords are securely hashed using bcrypt
Email verification before account activation
Role based authorization middleware
Organization scoped database queries
Protected API routes require authentication
Users cannot access resources belonging to another organization

Roadmap
Auth including register, login, and email verification
Team invitations
Role based permissions


Project Structure
WorkNest/
├── Backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authController.js
│   │   │   ├── authRoutes.js
│   │   │   └── ...
│   │   │
│   │   ├── organization/
│   │   │   ├── organizationController.js
│   │   │   ├── organizationRoutes.js
│   │   │   └── ...
│   │   │
│   │   ├── project/
│   │   │   └── ...
│   │   │
│   │   ├── task/
│   │   │   └── ...
│   │   │
│   │   ├── dashboard/
│   │   │   └── ...
│   │   │
│   │   ├── analytics/
│   │   │   └── ...
│   │   │
│   │   └── notification/
│   │       └── ...
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Organization.js
│   │   ├── Notification.js
│   │   └── Invitation.js
│   │
│   ├── utils/
│   │   ├── emailService.js
│   │   └── validatePassword.js
│   │
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
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
    │   │   └── api.js
    │   │
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── .env.example
    ├── package.json
    └── vite.config.js

Environment Variables
Create a .env file inside the Backend directory.
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
See .env.example for the required environment variables.
Never commit real environment variables or secrets to the repository.

Frontend Setup
cd frontend
npm install
npm run dev

Backend Setup
cd Backend
npm install
npm run dev
