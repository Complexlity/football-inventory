let express = require("express");
let router = express.Router();

const Player = require("../models/player");
const Club = require("../models/club");
const Position = require("../models/position");

/* GET home page. */
router.get("/", async function (req, res) {
  await Promise.all([
    Player.countDocuments({}),
    Club.countDocuments({}),
    Position.countDocuments({}),
  ])
    .then((results) => {
      player_count = results[0];
      club_count = results[1];
      position_count = results[2];
      const data = { player_count, club_count, position_count };
      res.render("index", {
        title: "My Home Page",
        data,
        error: "",
      });
    })
    .catch((error) => {
      res.render("index", {
        title: "My Home Page",
        error,
      });
    });
});

module.exports = router;
