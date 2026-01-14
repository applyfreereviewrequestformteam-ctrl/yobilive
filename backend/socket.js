module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket.id);

    // Join Room
    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", {
        user,
        socketId: socket.id,
      });
    });

    // Leave Room
    socket.on("leave-room", ({ roomId, user }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", {
        user,
        socketId: socket.id,
      });
    });

    // Text Message
    socket.on("send-message", ({ roomId, message, user }) => {
      io.to(roomId).emit("receive-message", {
        user,
        message,
        time: new Date(),
      });
    });

    // Gift System (Demo)
    socket.on("send-gift", ({ roomId, giftName, diamonds, sender }) => {
      io.to(roomId).emit("receive-gift", {
        giftName,
        diamonds,
        sender,
        time: new Date(),
      });
    });

    // Mic mute/unmute
    socket.on("mute-user", ({ roomId, targetId }) => {
      io.to(targetId).emit("muted");
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
