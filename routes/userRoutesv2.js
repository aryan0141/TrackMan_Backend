const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { auth } = require("../utils/authMiddleware");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const User = require("../models/userModel");
const { activationEmail } = require("../utils/mail");

// @Desc Register through formData
// @Route POST /auth/v2/user
// @Access Public
router.post("/auth/v2/user", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User Already exists");
    }

    // Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Save user in database
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate Token
    const token = generateToken(user._id, "1d");

    // Send Account Confirmation/Activation Email
    activationEmail({ to: user.email.trim(), token });

    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// @Desc Login through formData
// @Route POST /auth/v2/login
// @Access Public
router.post("/auth/v2/login", async (req, res) => {
  try {
    const { password, email } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(400);
      throw new Error("No such user exists");
    }

    // Verify Password
    const isMatch = await bcryptjs.compare(password, userExists.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Incorrect Password");
    }

    res.json({
      // _id: userExists._id,
      // name: userExists.name,
      // email: userExists.email,
      // token: generateToken(userExists._id, "1d"),

      ...userExists._doc,
      token: generateToken(userExists._id, "1d"),
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// @Desc    Send Activation Link If Normal Activation Link Expires
// @Route   /auth/v2/send-activation-link
// @Access  Private
router.get("/auth/v2/send-activation-link", auth, async (req, res) => {
  try {
    const userExists = await User.findById(req.user._id);

    if (!userExists) {
      res.status(400);
      throw new Error(JSON.stringify({ err: "No such user exists" }));
    }

    const token = generateToken(req.user._id, "1d");
    activationEmail({ to: userExists.email.trim(), token });

    res.status(200).json({ msg: "Activation Link Sent to your email" });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// @Desc    Activate User Account
// @Route   /auth/activate/:token
// @Access  Private
router.get("/auth/activate/:token", auth, async (req, res) => {
  //Token
  const token = req.params.token;

  try {
    const decoded = await jwt.verify(token, JWT_SECRET_KEY);
    const userExists = await User.findById(decoded.id).select("-password");

    if (!userExists) {
      res.status(400);
      throw new Error("Invalid Link");
    }

    if (req.user._id.toString() !== userExists._id.toString()) {
      res.status(400);
      throw new Error("Not authorized");
    }

    if (userExists.isActivated) {
      res.status(400);
      throw new Error("User account already activated");
    }
    userExists.isActivated = true;
    await userExists.save();
    res.status(200).json(userExists);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

const generateToken = (id, time) => {
  const payload = { id };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: time });
};

module.exports = router;
