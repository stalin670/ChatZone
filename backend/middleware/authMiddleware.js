const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
          res.status(403).json({ error: true, message: "Invalid token" });

        req.user = user;
        next();
      });
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = protect;
