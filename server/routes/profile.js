const { Router, request } = require("express");
const { check, validationResult } = require("express-validator");
const config = require("config");
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const RealEstate = require("../models/RealEstate");
const upload = require("../components/uploadingImages");

const router = Router();

router.get("/getUserData/:id", async (request, response) => {
  try {
    const userId = request.params.id;

    const user = await User.findById(userId)
    if (!user) return response.status(400).json({ message: "Error: User" });

    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.put(
  "/updateUserData/:id",
  upload.single("avatar"),
  [
    check("fullName").notEmpty().withMessage("Error: Full name"),
    check("numberPhone").notEmpty().withMessage("Error: Phone number"),
    check("email").notEmpty().withMessage("Error: Email")
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

      const userId = request.params.id;
      const avatar = request.file ? request.file.path : null;
      const { fullName, numberPhone, email, password } = request.body;

      const user = await User.findById(userId);
      if (!user) return response.status(400).json({ message: "Error: User" });
      
      if(avatar) {
        if(user.avatar !== config.get("defaultAvatar")) {
          const oldAvatarPath = path.join(__dirname, '..', user.avatar);
          fs.unlink(oldAvatarPath, (error) => {
            if (error) console.log(error);
          });
        }
        user.avatar = avatar;
      }
      user.fullName = fullName;
      user.numberPhone = numberPhone;
      user.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
      }
      
      await user.save();

      response.status(200).json({ message: 'Successful request' });
    } catch (error) {
      response.status(500).json({ message: "Error: Server" });
      console.log(error);
    }
  }
);

router.delete("/deleteUserData/:id", async (request, response) => {
  try {
    const userId = request.params.id;

    const user = await User.findById(userId);
    if (!user) return response.status(400).json({ message: "Error: User" });

    await RealEstate.deleteMany({ _id: { $in: user.realEstate } });
    await User.updateMany(
      { saveRealEstate: { $in: user.realEstate } },
      { $pull: { saveRealEstate: { $in: user.realEstate } } }
    );

    if (user.avatar !== config.get("defaultAvatar")) {
      const avatarPath = path.join(__dirname, "..", user.avatar);
      fs.unlink(avatarPath, (error) => {
        if (error) console.log(error);
      });
    }
    await User.findByIdAndDelete(userId);

    response.status(200).json({ message: "Successful request" });
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

module.exports = router;