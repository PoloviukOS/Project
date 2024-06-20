const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  avatar: { type: String },
  fullName: { type: String },
  numberPhone: { type: String },
  email: { type: String },
  password: { type: String },
  blocked: { type: Boolean, default: false },
  realEstate: [{ type: Types.ObjectId, ref: "RealEstate" }],
  saveRealEstate: [{ type: Types.ObjectId, ref: "RealEstate" }],
});

module.exports = model("User", schema);
