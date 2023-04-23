const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  abbr: {
    type: String,
    required: true,
    unique: true,
  },
});

PositionSchema.virtual("url").get(function () {
  return `/position/${this.name}`;
});

module.exports = mongoose.model("Position", PositionSchema);
