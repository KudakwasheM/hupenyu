const express = require("express");
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  softDeletePatient,
  restorePatient,
  // deletePatient,
} = require("../controllers/patientController");
const advancedResults = require("../middleware/advancedResults");

// Include other resource router
const visitRouter = require("./visitRoutes");

const Patient = require("../models/patientModel");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// Re-route into other resource router
router.use("/:patientId/visits", visitRouter);

router
  .route("/")
  .get(advancedResults(Patient), getPatients)
  .post(createPatient);
router.route("/:id").get(getPatient).put(updatePatient);
router
  .route("/delete/:id")
  .put(authorize("super", "admin", "doctor"), softDeletePatient);
router
  .route("/restore/:id")
  .put(authorize("super", "admin", "doctor"), restorePatient);

module.exports = router;
