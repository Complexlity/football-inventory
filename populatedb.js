#! /usr/bin/env node
require("dotenv").config();
console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Club = require("./models/club");
const Player = require("./models/player");
const Position = require("./models/position");

const clubs = [];

const positions = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose
const mongoDB = process.env.MONGODB_CONNECTION_STRING;

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createPositions();
  await createClubs();
  await createPlayers();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createPlayers() {
  console.log("Creating Players");
  await Promise.all([
    await playerCreate("Havertz", 29, positions[2], 50, clubs[0]),
    await playerCreate("Mikel", 20, positions[0], 26, clubs[1], true),
    await playerCreate("Juninho", 22, positions[1], 40, clubs[2]),
    await playerCreate("Griezmann", 40, positions[2], 12, clubs[3], true),
    await playerCreate("Ronaldo", 19, positions[0], 42, clubs[0], true),
    await playerCreate("De Gea", 25, positions[1], 60, clubs[1]),
    await playerCreate("Zapata", 27, positions[2], 150, clubs[2]),
    await playerCreate("Salah", 29, positions[0], 33, clubs[3], true),
    await playerCreate("Osimhen", 34, positions[1], 28, clubs[0]),
    await playerCreate("Maguire", 30, positions[2], 80, clubs[1]),
    await playerCreate("Robinho", 42, positions[0], 73, clubs[2], true),
    await playerCreate("Zidane", 28, positions[1], 45, clubs[3]),
    await playerCreate("Kepa", 28, positions[3], 54, clubs[0], true),
    await playerCreate("De Bruyne", 24, positions[3], 120, clubs[1], true),
    await playerCreate("Kahn", 28, positions[3], 88, clubs[2]),
    await playerCreate("Camavinga", 20, positions[3], 100, clubs[3]),
  ]);
  console.log("Creating Players Complete");
}
async function playerCreate(name, age, position, price, club, forSale = false) {
  console.log("Adding Player: " + name);

  const player = new Player({
    name,
    age,
    position,
    club,
    price,
    forSale,
  });

  await player.save();
  console.log("Added Player: " + name);

  club.players = [...club.players, player];
  console.log("Updating Club: " + club.name);

  await club.save();
  console.log("Updated Club: " + club.name);
}

async function createPositions() {
  console.log("Adding positions");
  await Promise.all([
    positionCreate("Goal Keeper", "GK"),
    positionCreate("Defender", "DF"),
    positionCreate("Midfielder", "MD"),
    positionCreate("Forward", "FWD"),
  ]);
}
async function createClubs() {
  console.log("Adding Clubs");
  await Promise.all([
    clubCreate("Chelsea", "England"),
    clubCreate("Real Madrid", "Spain"),
    clubCreate("Juventus", "Italy"),
    clubCreate("Bayern", "Germany"),
  ]);
}

async function clubCreate(name, country) {
  const club = new Club({ name, country });
  await club.save();
  clubs.push(club);
  console.log(`Added club: ${name} => ${country}`);
}

async function positionCreate(name, abbr) {
  const position = new Position({ name, abbr });
  await position.save();
  positions.push(position);
  console.log(`Added position: ${name}`);
}
