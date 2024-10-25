const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data.js");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoute.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8001;

connectDB();
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  return res.status(200).json({ data: "Api is running successfully" });
});

// Testing API
// app.get("/api/chat", (req, res) => {
//   return res.status(200).json({ chats });
// });

// app.get("/api/chat/:id", (req, res) => {
//   const singleChat = chats.find((chat) => chat._id === req.params.id);
//   return res.status(200).json({ singleChat });
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
});
