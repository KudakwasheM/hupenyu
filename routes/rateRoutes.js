const express = require("express");
const {
  getRate,
  createRate,
  updateRate,
} = require("../controllers/rateController");

const Rate = require("../models/rateModel");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/").post(createRate);
router.route("/:id").get(getRate).put(updateRate);

module.exports = router;
