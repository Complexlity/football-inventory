let express = require("express");
let router = express.Router();
let market_controller = require("../controllers/marketController");
router.get("/", market_controller.index);

module.exports = router;
