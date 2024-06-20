const { Router, request } = require("express");

const User = require("../models/User");
const RealEstate = require("../models/RealEstate");

const router = Router();

router.post("/getRealEstate", async (request, response) => {
  try {
    const { searchData, userId } = request.body;

    const user = await User.findById(userId).populate('saveRealEstate');
    if (!user) return response.status(400).json({ message: "Error: User" });

    const searchFields = ["fullAddress", "owner.fullName", "owner.numberPhone", "numberRooms", "price", "link", "description"];
    const realEstate = await RealEstate.find({
      _id: { $in: user.saveRealEstate.map(item => item._id) },
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

router.delete("/deleteRealEstate/:userId/:realEstateId", async (request, response) => {
  try {
    const { userId, realEstateId } = request.params;

    const user = await User.findById(userId).populate('saveRealEstate');
    if (!user) return response.status(400).json({ message: "Error: User" });

    user.saveRealEstate.pull(realEstateId);
    await user.save();

    response.status(200).json({ message: "Successful request" });
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

module.exports = router;