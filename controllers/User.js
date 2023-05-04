const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const express = require("express");
const router = express.Router();

// REGISTER

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(401).send("Email already exists");
    }
    const hashedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).send({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    !userFound && res.status(401).send("User not found");

    console.log(userFound);

    const bytes = CryptoJS.AES.decrypt(
      userFound.password,
      process.env.SECRET_KEY
    );
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
      return res.status(401).send("Invalid Password");
    }

    if (decryptedPassword) {
      const accessToken = jwt.sign(
        { id: userFound._id, isAdmin: userFound.isAdmin },
        process.env.SECRET_KEY,
        { expiresIn: "5d" }
      );
      const { password, ...others } = userFound._doc;
      res.status(200).json({ ...others, accessToken });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
