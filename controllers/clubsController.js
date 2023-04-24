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
