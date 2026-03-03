# SkillConnect

Full-stack MERN application for peer-to-peer skill swapping: learn and teach skills with built-in matching, sessions, online classroom (video/audio/screen share/chat/whiteboard), tests, and reviews.

## Tech Stack

- **Frontend:** React (JavaScript), Tailwind CSS, React Router DOM, Axios, React Hook Form, Zustand, Socket.io client, WebRTC
- **Backend:** Node.js, Express.js, Socket.io, JWT, bcrypt, express-validator, Zod
- **Database:** MongoDB Atlas, Mongoose

## Prerequisites

- Node.js 18+ (tested on v24.11.0)
- MongoDB Atlas cluster (or local MongoDB)

## Setup (Windows)

Open **Command Prompt** or **PowerShell** and run:

### 1. Backend

```cmd
cd c:\Projects\SkillConnectapp5\backend
npm install
copy .env.example .env
```

Edit `backend\.env`: set `MONGODB_URI` and `JWT_SECRET`, then:

```cmd
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

In a **second** terminal:

```cmd
cd c:\Projects\SkillConnectapp5\frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` and proxies `/api` and `/socket.io` to the backend.

**PowerShell note:** If `&&` fails, use separate commands or use `;` (e.g. `cd backend; npm install`).

**Quick setup (double-click):**  
- Run `install-backend.bat` then `install-frontend.bat` (once).  
- Edit `backend\.env` (MONGODB_URI, JWT_SECRET).  
- Run `run-backend.bat` in one terminal and `run-frontend.bat` in another.

### 3. Environment (backend `.env`)

- `PORT` – server port (default 5000)
- `MONGODB_URI` – MongoDB connection string (e.g. Atlas)
- `JWT_SECRET` – secret for signing JWTs
- `NODE_ENV` – development | production
- `CLIENT_ORIGIN` – frontend origin (e.g. http://localhost:3000) for CORS and Socket.io

## Features

- **Auth:** Username/email + password, bcrypt, JWT. No OAuth.
- **Profiles:** Name, About Me, Availability, Skills I Can Teach / Want to Learn, Instagram/LinkedIn/GitHub, Education.
- **Match & Requests:** Smart match recommendations, send/accept/reject/reschedule requests.
- **Sessions:** Tutor creates session (online: date/time; offline: location + mandatory Google Maps link).
- **Classroom:** Built-in room with live video/audio (WebRTC), screen sharing, live chat (Socket.io), collaborative whiteboard (pen, colors, eraser, embed image by URL).
- **Tests:** Tutor creates test with correct answers after session; learner attempts; auto-evaluation and score for both.
- **Reviews:** Learner reviews only users they had sessions with; Reviews You Gave / Reviews You Received.
- **Real-time:** Socket.io for chat, notifications, request/session updates, classroom.

## Routes

**Public:** Home, Browse Profiles, Blogs, About, How It Works, Login, Signup.

**Protected (JWT):** All above + Requests, Sessions, My Profile, Notifications, Reviews, Session Detail, Create Session, Classroom.

Logout clears the token (and Zustand persisted auth).
