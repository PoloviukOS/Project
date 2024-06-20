const { Router, request } = require("express");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const upload = require("../components/uploadingImages");
const User = require("../models/User");

const router = Router();

router.post(
  "/registration",
  upload.single("avatar"),
  [
    check("fullName").notEmpty().withMessage("Error: Full name"),
    check("numberPhone").notEmpty().withMessage("Error: Phone number"),
    check("email").notEmpty().withMessage("Error: Email"),
    check("password").notEmpty().withMessage("Error: Password"),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Error: Data",
        });
      }

      const { fullName, numberPhone, email, password } = request.body;
      const avatar = request.file ? request.file.path : config.get("defaultAvatar");

      const user = await User.findOne({ $or: [{ numberPhone }, { email }] });
      if (user) return response.status(400).json({ message: "Error: User" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ avatar, fullName, numberPhone, email, password: hashedPassword });
      await newUser.save();

      const role = (email == config.get("adminData.email") && 
                    password == config.get("adminData.password")) ? "admin" : "user";

      const token = jwt.sign(
        { userId: newUser.id, userRole: role },
        config.get("jwtSecret"),
        { expiresIn: "1h" }
      );

      response.status(200).json({ message: 'Successful request', token });
    } catch (error) {
      response.status(500).json({ message: "Error: Server" });
      console.log(error);
    }
  }
);

router.post(
  "/authorization",
  [
    check("email").notEmpty().withMessage("Error: Email"),
    check("password").notEmpty().withMessage("Error: Password"),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Error: Data",
        });
      }

      const { email, password } = request.body;

      const user = await User.findOne({ email });
      if (!user) return response.status(400).json({ message: "Error: User" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return response.status(400).json({ message: "Error: Password" });

      if(user.blocked) return response.status(400).json({ message: "Error: User is blocked" });

      const role = (email == config.get("adminData.email") && 
                    password == config.get("adminData.password")) ? "admin" : "user";

      const token = jwt.sign(
        { userId: user.id, userRole: role },
        config.get("jwtSecret"),
        { expiresIn: "1h" }
      );

      response.status(200).json({ message: 'Successful request', token });
    } catch (error) {
      response.status(500).json({ message: "Error: Server" });
      console.log(error);
    }
  }
);

module.exports = router;