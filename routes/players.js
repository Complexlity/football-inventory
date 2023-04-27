let express = require("express");
let router = express.Router();
let players_controller = require("../controllers/playersController");

router.use((req, res, next) => {
  global.active = "players";
  next();
});

router.get("/create", players_controller.create_get);
router.post("/create", players_controller.create_post);
router.get("/update/:id", players_controller.update_get);

router.get("/", players_controller.index);

router.get("/:id", players_controller.detail);

module.exports = router;
