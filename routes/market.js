let express = require("express");
let router = express.Router();
let market_controller = require("../controllers/marketController");

router.use((req, res, next) => {
  global.active = "market";
  next();
});
router.get("/", market_controller.index);

module.exports = router;
