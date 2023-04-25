const Player = require("../models/player");
const Club = require("../models/club");
const Position = require("../models/position");
exports.index = async (req, res) => {
  let error = "";
  let players = "";
  // Get all players
  try {
    players = await Player.find({}).populate({
      path: "club position",
      select: "name -_id",
    });
  } catch (err) {
    error = err;
  }
  res.render("players", { title: "All Players", players, error });
};

exports.create = async (req, res) => {
  let error = "";
  let clubs = "";
  let positions = "";
  // Get All Available Clubs
  try {
    await Promise.all([
      Club.find({}).sort({ name: "asc" }).exec(),
      (positions = Position.find({}).exec()),
    ]).then((data) => {
      clubs = data[0];
      positions = data[1];
    });
  } catch (err) {
    error = err;
  }
  console.log(positions);

  res.render("players_create", {
    title: "Create A New Player",
    error,
    clubs,
    positions,
  });
};
