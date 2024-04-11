const express = require("express");
const {
  getServices,
  getService,
  createService,
  updateService,
  softDeleteService,
  restoreService,
  // deleteService,
} = require("../controllers/serviceController");
const advancedResults = require("../middleware/advancedResults");

const Service = require("../models/serviceModel");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(advancedResults(Service), getServices)
  .post(createService);
router.route("/:id").get(getService).put(updateService);
router
  .route("/delete/:id")
  .put(authorize("super", "admin", "doctor"), softDeleteService);
router
  .route("/restore/:id")
  .put(authorize("super", "admin", "doctor"), restoreService);

module.exports = router;
