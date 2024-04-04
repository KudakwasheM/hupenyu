const express = require("express");
const {
  getVisits,
  getVisit,
  createVisit,
  updateVisit,
  restoreVisit,
  softDeleteVisit,
  visitFilesUpload,
} = require("../controllers/visitController");

const advancedResults = require("../middleware/advancedResults");
const Visit = require("../models/visitModel");
const { protect, authorize } = require("../middleware/auth");

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
  .post(authorize("doctor"), createVisit);
router.route("/:id").get(getVisit).put(authorize("doctor"), updateVisit);
router.route("/:id/files").put(visitFilesUpload);
router.route("/delete/:id").put(softDeleteVisit);
router.route("/restore/:id").put(restoreVisit);

module.exports = router;
