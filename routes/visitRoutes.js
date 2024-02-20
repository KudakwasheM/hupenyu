const express = require("express");
const {
  getVisits,
  getVisit,
  createVisit,
  updateVisit,
  deleteVisit,
} = require("../controllers/visitController");

const advancedResults = require("../middleware/advancedResults");
const Visit = require("../models/visitModel");

const router = express.Router();

router.route("/").get(advancedResults(Visit), getVisits).post(createVisit);
router.route("/:id").get(getVisit).put(updateVisit).delete(deleteVisit);

module.exports = router;
