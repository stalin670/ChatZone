const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModels");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json({
      success: false,
      message: "Content or Id not available",
    });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var messages = await Message.create(newMessage);

    messages = await messages.populate("sender", "name pic");
    messages = await messages.populate("chat");
    messages = await User.populate(messages, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: messages });

    res.status(200).json({
      success: true,
      message: "Messages updated successfully",
      messages,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    return res.status(200).json({
      success: true,
      message: "Message Fetched Successfully",
      messages,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

module.exports = {
  sendMessage,
  allMessages,
};
