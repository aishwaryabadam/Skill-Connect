import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket = null;

export function getSocket() {
  const token = useAuthStore.getState().token;
  if (!token) return null;
  if (socket?.connected) return socket;
  socket = io(window.location.origin, {
    path: '/socket.io',
    auth: { token },
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
