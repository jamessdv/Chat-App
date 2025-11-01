import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());

// Serve frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

const rooms = {}; // { roomName: { password, messages: [] } }

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("joinRoom", ({ roomName, password, userName }, callback) => {
    if (!rooms[roomName]) {
      rooms[roomName] = { password, messages: [] };
      socket.join(roomName);
      callback({ success: true, message: "Room created and joined!" });
    } else {
      if (rooms[roomName].password === password) {
        socket.join(roomName);
        socket.emit("loadMessages", rooms[roomName].messages);
        callback({ success: true, message: "Joined existing room!" });
      } else {
        callback({ success: false, message: "Wrong password!" });
      }
    }
  });

  socket.on("sendMessage", ({ roomName, userName, text }) => {
    const msg = { userName, text, time: new Date().toLocaleTimeString() };
    rooms[roomName]?.messages.push(msg);
    io.to(roomName).emit("newMessage", msg);
  });

  socket.on("disconnect", () => console.log("🔴 Client disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

