const Player = require("../models/player");
const Club = require("../models/club");
const Position = require("../models/position");

function filterItems(filtered, filter) {
  const filteredPositions = [...filtered];
  const index = filteredPositions.findIndex(
    (position) => position._id.toString() === filter._id.toString()
  );
  filteredPositions.splice(index, 1)[0];
  // filteredPositions.unshift(removed);
  return filteredPositions;
}

exports.index = async (req, res) => {
  let error = "";
  let players = "";
  // Get all players
  try {
    players = await Player.find({}).populate({
      path: "club position",
      select: "name",
    });
  } catch (err) {
    error = err;
  }
  res.render("players", { title: "All Players", players, error });
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  let error = "";
  let player = "";
  try {
    player = await Player.findOne({ _id: id }).populate("club position");
  } catch (err) {
    error = err;
  }
  res.render("players_detail", {
    title: `${player.name || "Player's Detail"} Page`,
    player,
    error,
  });
};

exports.create_get = async (req, res) => {
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

  res.render("players_create", {
    title: "Create A New Player",
    error,
    clubs,
    positions,
  });
};

exports.update_get = async (req, res) => {
  let playerId = req.params.id;
  let error = "";
  let clubs = "";
  let positions = "";
  let player = "";
  let filteredPositions, filteredClubs;
  // Get All Available Clubs
  try {
    await Promise.all([
      Club.find({}).sort({ name: "asc" }).exec(),
      Position.find({}).exec(),
      Player.findOne({ _id: playerId }).populate({
        path: "club position",
      }),
    ]).then((data) => {
      clubs = data[0];
      positions = data[1];
      player = data[2];
    });

    // Filter position to make the players position the first thing on the positions array
    filteredPositions = filterItems(positions, player.position);
    filteredClubs = filterItems(clubs, player.club);
  } catch (err) {
    error = err;
  }

  res.render("players_update", {
    title: `Update Player Details ${player ? `for ${player.name}` : ""}`,
    error,
    clubs: filteredClubs,
    positions: filteredPositions,
    player,
  });
  // res.json({ filteredClubs, filteredPositions });
};
