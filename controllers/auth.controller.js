const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/keys");
const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "That email is already taken." });

    user = await User.findOne({ username });
    if (user)
      return res.status(400).json({ msg: "That username is already taken." });

    const newUser = new User({ email, password, username });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id
      }
    };

    const token = await jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h"
    });

    let expirationDate = new Date();
    expirationDate = expirationDate.setHours(expirationDate.getHours() + 1);

    res.status(201).json({ token, expirationDate });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = await jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h"
    });

    let expirationDate = new Date();
    expirationDate = expirationDate.setHours(expirationDate.getHours() + 1);

    res.status(200).json({ token, expirationDate });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
};
