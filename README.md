# Appointment Booking System

A full-stack web application for managing doctor appointments. Patients can browse available time slots and book appointments. Doctors can manage their schedule, view bookings, and update appointment status.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7, Axios, React Calendar |
| State Management | Context API + useState |
| Backend | Node.js, Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| Containerization | Docker, Docker Compose |

---

## Features

- Register and login as a **Doctor** or **Patient**
- JWT-based authentication with role-based access control
- Calendar view showing available appointment slots
- Patients can book a slot with an optional reason for the visit
- Patients can cancel their pending appointments
- Doctors can add available time slots
- Doctors can mark appointments as **Completed** or **Cancel** them
- Responsive layout

---

## Folder Structure

```
appointment-booking-system/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios instance with JWT interceptor
│   │   ├── components/      # Reusable components (Navbar)
│   │   ├── context/         # AuthContext (login, logout, user state)
│   │   ├── layouts/         # MainLayout with Navbar + Outlet
│   │   ├── pages/           # Page components
│   │   ├── routes/          # React Router route definitions
│   │   ├── services/        # API call functions (auth, appointments)
│   │   └── styles/          # Global CSS
│   └── Dockerfile
├── server/                  # Node.js + Express backend
│   ├── prisma/              # Prisma schema and migrations
│   └── src/
│       ├── config/          # Prisma client
│       ├── controllers/     # Route handler logic
│       ├── middleware/       # Auth and role middleware
│       ├── routes/          # Express routers
│       └── server.js
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [PostgreSQL](https://www.postgresql.org/) (or Docker)

---

## Environment Variables

Create a `.env` file inside `server/`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/appointment_booking_system
JWT_SECRET=your_secret_key_here
PORT=5000
```

---

## Run Locally

### 1. Database

Make sure PostgreSQL is running and the database exists, then:

```bash
cd server
npm install
npx prisma migrate dev --name init
```

### 2. Backend

```bash
cd server
node src/server.js
```

Server runs on `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`

---

## Run with Docker

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Client | http://localhost:3000 |
| Server | http://localhost:5000 |
| Database | localhost:5432 |

> The server automatically runs `prisma migrate deploy` on startup.

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |

### Slots

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/slots` | Get all available slots | Auth |
| GET | `/api/slots/my` | Get doctor's own slots | Doctor |
| POST | `/api/slots` | Create a new slot | Doctor |
| DELETE | `/api/slots/:id` | Delete a slot | Doctor |

### Appointments

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/appointments/available` | Get available slots | Auth |
| GET | `/api/appointments/all` | Get all doctor appointments | Doctor |
| GET | `/api/appointments/my` | Get patient's appointments | Patient |
| POST | `/api/appointments/book` | Book an appointment | Patient |
| PATCH | `/api/appointments/:id/status` | Mark as completed | Doctor |
| DELETE | `/api/appointments/:id` | Cancel appointment | Auth |
