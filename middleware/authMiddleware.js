const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authMiddleware = async (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Bearer token found");
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token from Header:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "Not authorized" });
    }

    if (user.token !== token) {
      console.log(
        "Token mismatch: token in DB does not match token from header"
      );
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in authMiddleware:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authMiddleware;
