// server.js
// Simple chat app backend - Node.js + Express + Socket.io
// Handles: real-time messaging, dummy login, message timestamps

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Allow the React frontend (default Vite/CRA ports) to connect
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ---------- Dummy login (bonus requirement) ----------
// Any non-empty username "logs in" successfully. No real auth/DB needed.
app.post("/api/login", (req, res) => {
  const { username } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  return res.json({
    success: true,
    user: { username: username.trim() },
  });
});

// Simple health check
app.get("/", (req, res) => {
  res.send("Chat app backend is running.");
});

// ---------- In-memory chat history ----------
// Keeps the last N messages so new users joining can see recent context.
const MAX_HISTORY = 100;
let messageHistory = [];

// ---------- Socket.io real-time messaging ----------
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send chat history to the newly connected client
  socket.emit("chat_history", messageHistory);

  // A user joins with their username
  socket.on("user_join", (username) => {
    socket.data.username = username;
    console.log(`${username} joined the chat`);
    socket.broadcast.emit("system_message", {
      text: `${username} joined the chat`,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle incoming chat messages
  socket.on("send_message", (data) => {
    const message = {
      id: `${socket.id}-${Date.now()}`,
      username: data.username || "Anonymous",
      text: data.text,
      timestamp: new Date().toISOString(),
    };

    // Save to history
    messageHistory.push(message);
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift();
    }

    // Broadcast to everyone, including sender (so all clients render consistently)
    io.emit("receive_message", message);
  });

  // Typing indicator (nice touch, optional)
  socket.on("typing", (username) => {
    socket.broadcast.emit("user_typing", username);
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stop_typing");
  });

  socket.on("disconnect", () => {
    const username = socket.data.username;
    console.log(`User disconnected: ${socket.id}`);
    if (username) {
      socket.broadcast.emit("system_message", {
        text: `${username} left the chat`,
        timestamp: new Date().toISOString(),
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
