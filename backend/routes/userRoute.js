const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  allUsers,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware.js");

router.post("/login", login);
router.post("/signup", registerUser);
router.route("/").get(protect, allUsers);

module.exports = router;
