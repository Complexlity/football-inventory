const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;

const ClubSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
});

ClubSchema.virtual("url").get(function () {
  return `/club/${this.id}`;
});

module.exports = mongoose.model("Club", ClubSchema);
