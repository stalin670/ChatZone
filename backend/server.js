const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data.js");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8001;

app.get("/", (req, res) => {
  return res.status(200).json({ data: "Api is running successfully" });
});

app.get("/api/chat", (req, res) => {
  return res.status(200).send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((chat) => chat._id === req.params.id);
  return res.status(200).send(singleChat);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
