# SkillConnect

A full-stack peer-to-peer skill exchange platform where users can teach what they know and learn what they need — all in one place.

---

## Overview

SkillConnect enables users to connect based on complementary skills. A user who knows Python and wants to learn Guitar can find someone who knows Guitar and wants to learn Python, and they can exchange knowledge through a structured session flow — from browsing profiles, sending requests, scheduling sessions, and joining a live virtual classroom.

---

## Features

- **Browse & Match** — Discover users by the skills they teach and the skills they want to learn
- **Skill Exchange Requests** — Send, accept, reject, or reschedule swap requests with a match score
- **Session Management** — Schedule online or offline sessions with full status tracking
- **Live Classroom** — Real-time collaborative environment with:
  - WebRTC video/audio calling
  - Live shared whiteboard
  - In-session chat
- **Knowledge Tests** — Tutors can create MCQ assessments for learners post-session
- **Reviews & Ratings** — Leave feedback after completed sessions
- **Notifications** — Real-time in-app notifications via Socket.IO
- **Blogs** — Community blog posts for sharing knowledge
- **User Profiles** — Showcase skills, education, availability, and social links

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Zustand | Global auth state |
| Axios | HTTP client |
| Socket.IO Client | Real-time communication |
| React Hook Form | Form management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | WebSockets (chat, whiteboard, notifications) |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod / express-validator | Input validation |

---

## Project Structure

```
SkillConnect/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT auth middleware
│   │   ├── models/
│   │   │   ├── User.js             # Auth credentials
│   │   │   ├── Profile.js          # Skills, bio, social links
│   │   │   ├── Request.js          # Skill swap requests
│   │   │   ├── Session.js          # Scheduled sessions
│   │   │   ├── Test.js             # MCQ assessments
│   │   │   ├── Review.js           # Session reviews
│   │   │   ├── Notification.js     # In-app notifications
│   │   │   └── Blog.js             # Community blog posts
│   │   ├── routes/
│   │   │   ├── auth.js             # Register / Login
│   │   │   ├── profiles.js         # Profile CRUD & search
│   │   │   ├── requests.js         # Skill swap request management
│   │   │   ├── sessions.js         # Session scheduling & status
│   │   │   ├── tests.js            # Test creation & attempts
│   │   │   ├── reviews.js          # Post-session reviews
│   │   │   ├── notifications.js    # Notification fetch & mark-read
│   │   │   └── blogs.js            # Blog CRUD
│   │   ├── services/
│   │   │   └── socketService.js    # Shared Socket.IO instance
│   │   └── server.js              # App entry point, Socket.IO handlers
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js            # Axios instance with auth header
│   │   │   └── socket.js           # Socket.IO client setup
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Browse.jsx          # Search & filter profiles
│   │   │   ├── Profile.jsx         # View another user's profile
│   │   │   ├── MyProfile.jsx       # Edit own profile
│   │   │   ├── Requests.jsx        # Manage incoming/outgoing requests
│   │   │   ├── Sessions.jsx        # Session list
│   │   │   ├── SessionDetail.jsx   # Session info & actions
│   │   │   ├── Classroom.jsx       # Live video + whiteboard + chat
│   │   │   ├── Reviews.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Blogs.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── About.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── store/
│   │   │   └── authStore.js        # Zustand auth store
│   │   ├── App.jsx                 # Routes definition
│   │   └── main.jsx
│   └── package.json
│
├── install-backend.bat
├── install-frontend.bat
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB instance)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skillconnect.git
cd skillconnect
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/skillconnect
JWT_SECRET=your-strong-secret-key
NODE_ENV=development
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`.

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

### Windows Quick Start

Double-click the provided batch scripts in the root folder:

1. `install-backend.bat` — Installs backend dependencies
2. `install-frontend.bat` — Installs frontend dependencies
3. `run-backend.bat` — Starts the backend server
4. `run-frontend.bat` — Starts the frontend dev server

---

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Login and receive JWT |
| `GET` | `/profiles` | No | Browse & search profiles |
| `GET` | `/profiles/:userId` | No | View a user's profile |
| `PUT` | `/profiles` | Yes | Update own profile |
| `POST` | `/requests` | Yes | Send a skill swap request |
| `GET` | `/requests` | Yes | Get incoming & outgoing requests |
| `PATCH` | `/requests/:id` | Yes | Accept / reject / reschedule |
| `POST` | `/sessions` | Yes | Create a session from accepted request |
| `GET` | `/sessions` | Yes | List user's sessions |
| `GET` | `/sessions/:id` | Yes | Get session details |
| `PATCH` | `/sessions/:id/status` | Yes | Update session status |
| `POST` | `/tests` | Yes | Create a test for a session |
| `POST` | `/tests/:id/attempt` | Yes | Submit test answers |
| `POST` | `/reviews` | Yes | Submit a session review |
| `GET` | `/notifications` | Yes | Fetch notifications |
| `PATCH` | `/notifications/:id/read` | Yes | Mark notification as read |
| `GET` | `/blogs` | No | List blog posts |
| `POST` | `/blogs` | Yes | Create a blog post |
| `GET` | `/health` | No | Server health check |

---

## Real-Time Events (Socket.IO)

Authentication is required via a JWT token passed in the socket handshake.

| Event | Direction | Description |
|---|---|---|
| `join_notifications` | Client → Server | Subscribe to personal notification room |
| `join_room` | Client → Server | Join a classroom session room |
| `leave_room` | Client → Server | Leave a classroom session room |
| `chat_message` | Bidirectional | Send/receive in-session chat messages |
| `whiteboard_draw` | Bidirectional | Broadcast whiteboard strokes |
| `whiteboard_clear` | Bidirectional | Clear the shared whiteboard |
| `webrtc_offer` | Bidirectional | WebRTC connection offer |
| `webrtc_answer` | Bidirectional | WebRTC connection answer |
| `webrtc_ice` | Bidirectional | ICE candidate exchange |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_ORIGIN` | No | Frontend URL for CORS (default: `http://localhost:3000`) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).
