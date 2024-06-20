const { Router, request } = require("express");
const config = require("config");
const fs = require('fs');
const path = require('path');

const User = require("../models/User");
const RealEstate = require("../models/RealEstate");

const router = Router();

router.post("/getDataUsers", async (request, response) => {
  try {
    const { searchData, userId } = request.body;

    const searchFields = ["fullName", "numberPhone", "email"];
    const users = await User.find({
      _id: { $ne: userId },
      $or: searchFields.map(field => ({
        [field]: { $regex: searchData, $options: "i" }
      }))
    });

    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.patch("/blockUser/:id", async (request, response) => {
  try {
    const userId = request.params.id;

    const user = await User.findById(userId);
    if (!user) return response.status(400).json({ message: "Error: User" });

    user.blocked = !user.blocked;
    await user.save();

    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.delete("/deleteUser/:id", async (request, response) => {
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
