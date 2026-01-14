const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("🔥 Live Voice App Backend Running");
});

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("send-message", ({ roomId, message, user }) => {
    io.to(roomId).emit("receive-message", {
      user,
      message,
    });
  });

  socket.on("send-gift", ({ roomId, gift, sender }) => {
    io.to(roomId).emit("receive-gift", {
      gift,
      sender,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Server Start
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
