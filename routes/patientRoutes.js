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
const Patient = require("../models/patientModel");
const { protect, authorize } = require("../middleware/auth");

// Include other resource router
// const visitRouter = require("./visitRoutes");

const router = express.Router();

// Re-route into other resource router
// router.use("/:patientId/visits", visitRouter);

router.use(protect);

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
