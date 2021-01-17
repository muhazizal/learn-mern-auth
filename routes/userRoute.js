const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const userAuth = require("../middleware/userAuth");

// Register new user
router.post("/register", async (req, res) => {
  try {
    // Store body request
    const { email, password, passwordCheck } = req.body;
    let displayName = req.body.displayName;

    // Validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ message: "Not all fields have been entered." });
    }

    if (password.length < 5) {
      return res.status(400).json({ message: "The password needs to be at least 5 characters long." });
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ message: "Enter the shame password twice fro verification." });
    }

    // Check user exist
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    if (!displayName) {
      displayName = email;
    }

    // Hashing password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Store new user to database
    const newUser = new UserModel({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    // Store body request
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Not all fields have been entered." });
    }

    // Check user exist
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "No account with this email has been registered." });
    }

    // Check password matching
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Sign JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user logged in
router.delete("/delete", userAuth, async (req, res) => {
  try {
    // Check user exist and delete user
    const deletedUser = await UserModel.findByIdAndDelete(req.user);

    if (!deletedUser) {
      res.status(400).json({ message: "There is no user to delete" });
    }

    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check is token
router.post("/isTokenValid", async (req, res) => {
  try {
    // Check token exist
    const token = req.header("x-auth-token");
    if (!token) {
      res.json(false);
    }

    // Verify token
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenVerified) {
      res.json(false);
    }

    // Check user exist
    const user = await UserModel.findById(tokenVerified.id);
    if (!user) {
      res.json(false);
    }

    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get logged in user data
router.get("/", userAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user);

    // Check user exist
    if (!user) {
      res.status(400).json({ message: "User id not valid" });
    }

    res.json({
      displayName: user.displayName,
      id: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
