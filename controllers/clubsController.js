const Club = require("../models/club");
const Position = require("../models/position");
const { body, validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  let error = "";
  let clubs = {};
  // Find all clubs
  try {
    clubs = await Club.find({}).sort({ name: "asc" });
    return res.render("clubs", { title: "Clubs Home Page", clubs, error });
  } catch (err) {
    error = err;
    return next(err);
  }
};

exports.create_get = (req, res) => {
  res.render("clubs_create", { title: "Create New Club", error: "" });
};

exports.create_post = [
  body("clubname", "Name Cannot Be Blank").notEmpty().trim().escape(),
  body("country", "Clubs Must Have A Country").notEmpty().trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const clubName = req.body.clubname;
    const countryName = req.body.country;
    if (!errors.isEmpty()) {
      return res.render("clubs_create", {
        title: "Create New Club",
        clubname: clubName,
        country: countryName,
        error: "Some Values Are Missing",
      });
    }
    const newClub = new Club({
      name: clubName,
      country: countryName,
      players: [],
    });
    newClub
      .save()
      .then(() => {
        res.redirect("/clubs");
      })
      .catch((err) => {
        // res.render("clubs_create", {
        //   title: "Create New Club",
        //   error: err,
        // });
        return next(err);
      });
  },
];

exports.detail = async (req, res, next) => {
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

    const players = club.players;
    if (players.length === 0) {
      groupedPlayers = [];
      groupedPlayers = [];
    } else {
      groupedPlayers = players.reduce((acc, player) => {
        const positionName = player.position.name.toLowerCase();
        if (!acc[positionName]) {
          acc[positionName] = [];
        }
        acc[positionName].push(player);
        return acc;
      }, {});
    }
    res.render("clubs_detail", {
      title: "Club Page",
      error,
      players: groupedPlayers,
      club,
    });
  } catch (err) {
    error = err;
    return next(err);
  }
};

exports.player_create_get = async (req, res) => {
  let error = "";
  let positions = "";
  let clubs = "";
  let id = req.params.id;
  // Get All Available Clubs
  try {
    await Promise.all([
      Club.findOne({ _id: id }).exec(),
      (positions = Position.find({}).exec()),
    ]).then((data) => {
      clubs = data[0];
      positions = data[1];
    });
  } catch (err) {
    error = err;
    return next(err);
  }

  res.render("players_create", {
    title: `Create A New Player for ${clubs.name || ""}`,
    error,
    clubs,
    positions,
  });
};
