let express = require("express");
let router = express.Router();
let clubs_controller = require("../controllers/clubsController");

router.use((req, res, next) => {
  global.active = "clubs";
  next();
});

router.get("/", clubs_controller.index);
router.get("/create", clubs_controller.create_get);
router.get("/:id/create", clubs_controller.player_create_get);
router.get("/:id", clubs_controller.detail);

module.exports = router;
