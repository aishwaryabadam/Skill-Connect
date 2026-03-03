import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import profilesRoutes from './routes/profiles.js';
import requestsRoutes from './routes/requests.js';
import sessionsRoutes from './routes/sessions.js';
import testsRoutes from './routes/tests.js';
import reviewsRoutes from './routes/reviews.js';
import notificationsRoutes from './routes/notifications.js';
import blogsRoutes from './routes/blogs.js';
import { User } from './models/User.js';
import { setIO } from './services/socketService.js';
import chatRoute from "./routes/chat.route.js";

await connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', methods: ['GET', 'POST'] },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use(express.json());
app.use("/api/chat", chatRoute);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const userSockets = new Map();
const roomWhiteboards = new Map();
const roomChats = new Map();

const getUserId = (socket) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

io.use((socket, next) => {
  const userId = getUserId(socket);
  if (!userId) return next(new Error('Auth required'));
  socket.userId = userId;
  next();
});

setIO(io);

io.on('connection', (socket) => {
  userSockets.set(socket.userId, socket.id);

  socket.on('join_notifications', () => {
    socket.join(`notifications:${socket.userId}`);
  });

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    if (!roomChats.has(roomId)) roomChats.set(roomId, []);
    socket.emit('room_chat_history', roomChats.get(roomId) || []);
    if (roomWhiteboards.has(roomId)) {
      socket.emit('whiteboard_state', roomWhiteboards.get(roomId));
    }
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    if (socket.roomId === roomId) socket.roomId = null;
  });

  socket.on('chat_message', async (data) => {
    const { roomId, text } = data;
    if (!roomId || !text?.trim()) return;
    const userId = socket.userId;
    const user = await User.findById(userId).select('username').lean();
    const msg = {
      id: Date.now().toString(),
      userId,
      username: user?.username || 'User',
      text: text.trim(),
      at: new Date().toISOString(),
    };
    if (!roomChats.has(roomId)) roomChats.set(roomId, []);
    roomChats.get(roomId).push(msg);
    io.to(roomId).emit('chat_message', msg);
  });

  socket.on('whiteboard_draw', (data) => {
    const roomId = socket.roomId || data.roomId;
    if (!roomId) return;
    if (!roomWhiteboards.has(roomId)) roomWhiteboards.set(roomId, []);
    roomWhiteboards.get(roomId).push(data);
    socket.to(roomId).emit('whiteboard_draw', data);
  });

  socket.on('whiteboard_clear', (roomId) => {
    const r = roomId || socket.roomId;
    if (r) {
      roomWhiteboards.set(r, []);
      io.to(r).emit('whiteboard_clear');
    }
  });

  socket.on('webrtc_offer', ({ to, roomId, offer }) => {
    io.to(roomId).emit('webrtc_offer', { from: socket.userId, offer });
  });

  socket.on('webrtc_answer', ({ to, roomId, answer }) => {
    io.to(roomId).emit('webrtc_answer', { from: socket.userId, answer });
  });

  socket.on('webrtc_ice', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc_ice', { from: socket.userId, candidate });
  });

  socket.on('disconnect', () => {
    userSockets.delete(socket.userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
