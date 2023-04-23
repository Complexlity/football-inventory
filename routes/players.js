let express = require("express");
let router = express.Router();
let players_controller = require("../controllers/playersController");

router.get("/", players_controller.index);

module.exports = router;
