const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getPayments,
  createPayment,
  updatePayment,
  softDeletePayment,
  restorePayment,
  getPayment,
} = require("../controllers/paymentController");

const Payment = require("../models/paymentModel");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(advancedResults(Payment), getPayments)
  .post(createPayment);
router.route("/:id").get(getPayment).put(updatePayment);
router
  .route("/delete/:id")
  .put(authorize("super", "admin", "doctor"), softDeletePayment);
router
  .route("/restore/:id")
  .put(authorize("super", "admin", "doctor"), restorePayment);

module.exports = router;
