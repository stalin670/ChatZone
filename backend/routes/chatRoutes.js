const express = require("express");

const router = express.Router();

const {
  accessChat,
  fetchChats,
  createGroupChat,
} = require("../controllers/chatControllers");
const protect = require("../middleware/authMiddleware.js");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
// router.route("/").post(protect, accessChat);
// router.route("/").post(protect, accessChat);

module.exports = router;
