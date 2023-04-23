const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 10,
  },
  age: {
    type: Number,
    required: true,
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: "Position",
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: "Club",
  },
  price: {
    type: Number,
    default: 0,
  },
  forSale: {
    type: Boolean,
    default: false,
  },
});

PlayerSchema.virtual("url").get(function () {
  return `/players/${this._id}`;
});

module.exports = mongoose.model("Player", PlayerSchema);
