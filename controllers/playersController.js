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

exports.create_post = async (req, res) => {
  let clubId, positionId, club;
  const name = req.body.playername;
  const age = req.body.age;
  const positionAbbr = req.body.position;
  const clubName = req.body.club;
  const price = req.body.price;
  const forSale = req.body.forsale === "1";

  //------------------------
  // VALIDATE INPUTS HERE
  //------------------------
  await Promise.all([
    Club.findOne({ name: clubName }),
    Position.findOne({ abbr: positionAbbr }),
  ])
    .then(async (result) => {
      // return;
      club = result[0];
      clubId = club._id;
      positionId = result[1]._id;
      console.log("I am here");

      const newPlayer = new Player({
        name,
        age,
        position: positionId,
        club: clubId,
        price,
        forSale,
      });
      club.players.push(newPlayer);
      await Promise.all([newPlayer.save(), club.save()]);
      return res.redirect(`/clubs/${clubId}`);
    })

    .catch((err) => {
      res.redirect(`/players/create`);
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

exports.update_post = async (req, res) => {
  let player, newClub, position, positionId, clubId, oldClub;
  const id = req.params.id;
  const {
    playername: name,
    age,
    position: abbr,
    club,
    price,
    forsale,
  } = req.body;
  //------------------------
  // VALIDATE INPUTS HERE
  //------------------------

  await Promise.all([
    Player.findOne({ _id: id }),
    Position.findOne({ abbr }),
    Club.findOne({ name: club }),
  ]).then(async (result) => {
    player = result[0];
    positionId = result[1]._id;
    newClub = result[2];
    clubId = newClub._id;

    // Check if old and new club are not the same. Deletes player from old club and adds player to new club
    if (player.club !== clubId) {
      oldClub = await Club.findOne({ _id: player.club });
      oldClub.players = oldClub.players.filter((value) => value !== player._id);
      newClub.players.push(player._id);
    }

    // Assign player to newly updated values
    player.name = name;
    player.age = age;
    player.club = clubId;
    player.position = positionId;
    player.price = price;
    player.forSale = forsale === "1";

    await Promise.all([player.save(), newClub.save(), oldClub.save()]);
    res.redirect("/players");
  });
};
