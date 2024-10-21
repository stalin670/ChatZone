const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all details",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists !", success: false });
    }

    const newUser = new User({ name, email, password, pic });
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();

    const jwtToken = jwt.sign(
      { email: newUser.email, _id: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      jwtToken,
      message: "Signup Successfully.",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "User does not exist!", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ message: "Password does not match", success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      message: "Logged in Successfully",
      success: true,
      jwtToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  login,
  registerUser,
};
