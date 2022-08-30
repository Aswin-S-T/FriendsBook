const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  message: { type: String },
  username: { type: String },
  room: { type: String },
  time: { type: String },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
