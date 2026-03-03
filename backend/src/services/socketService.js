let io = null;

export function setIO(server) {
  io = server;
}

export function getIO() {
  return io;
}

export function emitToUser(userId, event, payload) {
  if (io) {
    const room = `notifications:${userId}`;
    io.to(room).emit(event, payload);
  }
}
