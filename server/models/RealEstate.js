const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  avatar: { type: String },
  fullAddress: { type: String },
  owner: {
    avatar: { type: String },
    fullName: { type: String },
    numberPhone: { type: String }
  },
  numberRooms: { type: String },
  price: { type: String },
  link: { type: String },
  description: { type: String },
});

module.exports = model("RealEstate", schema);