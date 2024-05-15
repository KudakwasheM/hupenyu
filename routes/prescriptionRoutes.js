const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  softDeletePrescription,
  restorePrescription,
} = require("../controllers/prescriptionController");

const router = express.Router();

router.use(protect);
router.use(authorize("super", "admin", "doctor"));

router.route("/").get(getPrescriptions).post(createPrescription);
router.route("/:id").get(getPrescription).put(updatePrescription);
router.route("/delete/:id").put(softDeletePrescription);
router.route("/restore/:id").put(restorePrescription);

module.exports = router;
