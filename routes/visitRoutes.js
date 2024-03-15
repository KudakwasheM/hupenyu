const express = require("express");
const {
  getVisits,
  getVisit,
  createVisit,
  updateVisit,
  restoreVisit,
  softDeleteVisit,
} = require("../controllers/visitController");

const advancedResults = require("../middleware/advancedResults");
const Visit = require("../models/visitModel");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(
    advancedResults(Visit, {
      path: "patient",
      select: "name",
    }),
    getVisits
  )
  .post(createVisit);
router.route("/:id").get(getVisit).put(updateVisit);
router.route("/delete/:id").put(softDeleteVisit);
router.route("/restore/:id").put(restoreVisit);

module.exports = router;
