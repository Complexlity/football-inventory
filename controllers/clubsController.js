const Club = require("../models/club");

exports.index = async (req, res) => {
  let error = "";
  let clubs = {};
  // Find all clubs
  try {
    clubs = await Club.find({}).sort({ name: "asc" });
    console.log(clubs);
  } catch (err) {
    error = err;
  }
  res.render("clubs", { title: "Clubs Home Page", clubs, error });
};

exports.create = (req, res) => {
  res.render("clubs_create", { title: "Create New Club", error: "" });
};

exports.detail = async (req, res) => {
  let error = "";
  let club = "";
  const id = req.params.id;
  let groupedPlayers = [];

  try {
    club = await Club.findOne({ _id: id })
      .populate({
        path: "players",
        populate: { path: "position" },
      })
      .populate("players.positon");
    // console.log(club);

    const players = club.players;
    // console.log(players);

    groupedPlayers = players.reduce((acc, player) => {
      const positionName = player.position.name.toLowerCase();
      if (!acc[positionName]) {
        acc[positionName] = [];
      }
      acc[positionName].push(player);
      return acc;
    }, {});
    console.log(groupedPlayers);
  } catch (err) {
    error = err;
  }
  res.render("clubs_detail", {
    title: "Club Page",
    error,
    players: groupedPlayers,
    club,
  });
};
