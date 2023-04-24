const Player = require("../models/player");

exports.index = async (req, res) => {
  let error = "";
  let players = "";
  try {
    players = await Player.find({}).populate({
      path: "club position",
      select: "name -_id",
    });
  } catch (err) {
    error = err;
  }
  res.render("players", { title: "Players Page", players, error });
};
