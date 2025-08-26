**Investor-Client Meet:**

🚀 A production-ready authentication and onboarding module for a startup idea platform.
Supports **Thinkers (idea creators), Investors (funders), and Mentors (experts)**.

## 🔐 Features
- Signup/Login with 3 roles (Thinker, Investor, Mentor)
- Email verification flow
- Secure password hashing (bcrypt)
- JWT-based access & refresh tokens
- Role-based access control (RBAC)
- Protected API routes
- Forgot/Reset password (frontend + admin override script)
- Modular backend (Express + MongoDB + Mongoose)
- Frontend with React + Vite + TailwindCSS
- Postman/Thunder client collection included

## 🏗️ Tech Stack
- **Frontend:** React.js, TailwindCSS, Vite
- **Backend:** Node.js (Express.js), MongoDB (Mongoose)
- **Auth:** JWT, bcrypt
- **Security:** CORS, Helmet, dotenv

## 🚀 Getting Started

### Backend

bash
cd backend
cp .env.example .env   # update values
npm install
npm run dev


### Frontend

cd frontend
cp .env.example .env   # update values
npm install
npm run dev


Frontend runs on http://localhost:5173
Backend runs on http://localhost:5001
