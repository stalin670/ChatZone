const express = require("express");

const router = express.Router();

const { accessChat, fetchChats } = require("../controllers/chatControllers");
const protect = require("../middleware/authMiddleware.js");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
// router.route("/").post(protect, accessChat);
// router.route("/").post(protect, accessChat);
// router.route("/").post(protect, accessChat);

module.exports = router;
