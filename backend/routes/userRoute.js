const express = require("express");
const router = express.Router();

const { registerUser, login } = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", registerUser);

module.exports = router;
