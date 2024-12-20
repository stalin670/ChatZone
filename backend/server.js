const express = require("express");
const path = require("path");
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

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Testing API
// app.get("/api/chat", (req, res) => {
//   return res.status(200).json({ chats });
// });

// app.get("/api/chat/:id", (req, res) => {
//   const singleChat = chats.find((chat) => chat._id === req.params.id);
//   return res.status(200).json({ singleChat });
// });

app.get("/", (req, res) => {
  return res.status(200).json({ data: "Api is running successfully" });
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//--------------------------------Deploy-------------------------------//

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) => {
//     return res.sendFile(
//       path.resolve(__dirname1, "frontend", "build", "index.html")
//     );
//   });
// } else {
//   app.get("/", (req, res) => {
//     return res.status(200).json({ data: "Api is running successfully" });
//   });
// }

//--------------------------------Deploy-------------------------------//

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

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
