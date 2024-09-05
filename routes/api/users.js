const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const { userSchema } = require("../../models/validationSchemas");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: `Validation error: ${error.details[0].message}`,
      });
    }

    const { email, password } = value;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      status: "success",
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      console.log(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        status: "error",
        message: `Validation error: ${error.details[0].message}`,
      });
    }

    const { email, password } = value;
    console.log(`Trying to find user with email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({
        status: "error",
        message: "Email or password is wrong",
      });
    }

    const isMatch = bcrypt.compare(password, user.password);
    console.log(`Password to check: ${password}`);
    console.log(`Stored hashed password: ${user.password}`);
    console.log(`Password match result: ${isMatch}`);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Email or password is wrong",
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    user.token = token;
    await user.save();

    console.log(`Login successful for user: ${email}`);
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.get("/logout", authMiddleware, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

router.get("/current", authMiddleware, (req, res) => {
  res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

router.patch("/subscription", authMiddleware, async (req, res) => {
  const { subscription } = req.body;
  const validSubscriptions = ["starter", "pro", "business"];

  if (!validSubscriptions.includes(subscription)) {
    return res.status(400).json({
      status: "error",
      message:
        "Invalid subscription type. Allowed values: ['starter', 'pro', 'business']",
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { subscription },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Subscription updated successfully",
      data: { subscription: updatedUser.subscription },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

module.exports = router;
