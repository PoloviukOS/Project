const { Router, request } = require("express");

const User = require("../models/User");
const RealEstate = require("../models/RealEstate");

const router = Router();

router.post("/getRealEstate", async (request, response) => {
  try {
    const { fullAddress, numberRooms, price } = request.body;

    const realEstate = await RealEstate.find({
      $and: [
        { "fullAddress": { $regex: fullAddress, $options: "i" } },
        { "numberRooms": { $regex: numberRooms, $options: "i" } },
        { "price": { $regex: price, $options: "i" } }
      ]
    });

    response.status(200).json(realEstate);
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.get("/getUserRealEstate/:id", async (request, response) => {
  try {
    const userId = request.params.id;

    const user = await User.findById(userId).populate('saveRealEstate');
    if (!user) return response.status(400).json({ message: "Error: User" });

    response.status(200).json(user.saveRealEstate);
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.get("/saveRealEstate/:userId/:realEstateId", async (request, response) => {
  try {
    const { userId, realEstateId } = request.params;

    const user = await User.findById(userId);
    if (!user) return response.status(400).json({ message: "Error: User" });

    const realEstate = await RealEstate.findById(realEstateId);
    if (!realEstate) return response.status(400).json({ message: "Error: Reasl Estate" });

    user.saveRealEstate.push(realEstateId);
    await user.save();

    response.status(200).json({ message: "Successful request" });
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

router.delete("/deleteRealEstate/:userId/:realEstateId", async (request, response) => {
  try {
    const { userId, realEstateId } = request.params;

    const user = await User.findById(userId);
    if (!user) return response.status(400).json({ message: "Error: User" });

    const realEstate = await RealEstate.findById(realEstateId);
    if (!realEstate) return response.status(400).json({ message: "Error: Reasl Estate" });

    user.saveRealEstate.pull(realEstateId);
    await user.save();

    response.status(200).json({ message: "Successful request" });
  } catch (error) {
    response.status(500).json({ message: "Error: Server" });
    console.log(error);
  }
});

module.exports = router;