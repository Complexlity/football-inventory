let express = require("express");
let router = express.Router();
let clubs_controller = require("../controllers/clubsController");

router.get("/", clubs_controller.index);

module.exports = router;
