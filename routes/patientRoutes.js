const express = require("express");
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const advancedResults = require("../middleware/advancedResults");
const Patient = require("../models/patientModel");

// Include other resource router
const visitRouter = require("./visitRoutes");

const router = express.Router();

// Re-route into other resource router
router.use("/:patientId/visits", visitRouter);

router
  .route("/")
  .get(advancedResults(Patient), getPatients)
  .post(createPatient);
router.route("/:id").get(getPatient).put(updatePatient).delete(deletePatient);

module.exports = router;
