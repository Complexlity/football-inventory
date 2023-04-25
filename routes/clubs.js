let express = require("express");
let router = express.Router();
let clubs_controller = require("../controllers/clubsController");

router.use((req, res, next) => {
  global.active = "clubs";
  next();
});

router.get("/", clubs_controller.index);

module.exports = router;
