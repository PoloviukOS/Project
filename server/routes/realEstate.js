const { Router, request } = require("express");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const RealEstate = require("../models/RealEstate");
const upload = require("../components/uploadingImages");

const router = Router();

router.post(
  "/addRealEstate",
  upload.single("avatar"),
  [
    check("fullAddress").notEmpty().withMessage("Error: Full address"),
    check("numberRooms").notEmpty().withMessage("Error: Number of rooms"),
    check("price").notEmpty().withMessage("Error: Price"),
    check("description").notEmpty().withMessage("Error: Description"),
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

      const { userId, fullAddress, numberRooms, price, link, description } = request.body;
      const avatar = request.file ? request.file.path : null;
      
      if (!avatar) return response.status(400).json({ message: "Error: Avatar" });

      const user = await User.findById(userId);
      if (!user) return response.status(400).json({ message: "Error: User" });

      const realEstate = new RealEstate({
        avatar,
        fullAddress,
        owner: {
          avatar: user.avatar,
          fullName: user.fullName,
          numberPhone: user.numberPhone
        },
        numberRooms,
        price,
        link,
        description,
      });
      await realEstate.save();

      user.realEstate.push(realEstate._id);
      await user.save();

      response.status(200).json({ message: "Successful request" });
    } catch (error) {
      response.status(500).json({ message: "Error: Server" });
      console.log(error);
    }
  }
);

router.post("/getRealEstate", async (request, response) => {
  try {
    const { searchData, userId } = request.body;

    const user = await User.findById(userId).populate("realEstate");
    if (!user) return response.status(400).json({ message: "Error: User" });

    const searchFields = ["fullAddress", "numberRooms", "price", "link", "description"];
    const realEstate = await RealEstate.find({
      _id: { $in: user.realEstate },
      $or: searchFields.map(field => ({
        [field]: { $regex: searchData, $options: "i" }
      }))
    });

    response.status(200).json(realEstate);
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.delete("/deleteRealEstate/:id", async (request, response) => {
  try {
    const realEstateId = request.params.id;

    const realEstate = await RealEstate.findByIdAndDelete(realEstateId);
    if (!realEstate) return response.status(400).json({ message: "Error: Real estate" });

    const user = await User.findOneAndUpdate(
      { $or: [{ realEstate: realEstateId }, { saveRealEstate: realEstateId }] },
      { $pull: { realEstate: realEstateId, saveRealEstate: realEstateId } },
    );
    if (!user) return response.status(400).json({ message: "Error: User" });

    const avatarPath = path.join(__dirname, "..", realEstate.avatar);
    fs.unlink(avatarPath, (error) => {
      if (error) console.log(error);
    });

    response.status(200).json({ message: "Successful request" });
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

module.exports = router;
