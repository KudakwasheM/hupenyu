const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  createBilling,
  getBillings,
  getBilling,
  updateBilling,
  softDeleteBilling,
  restoreBilling,
} = require("../controllers/billingController");

const Billing = require("../models/billingModel");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(
    advancedResults(Billing, { path: "patient", select: "name" }),
    getBillings
  )
  .post(createBilling);
router.route("/:id").get(getBilling).put(updateBilling);
router.route("/delete/:id").put(softDeleteBilling);
router.route("/restore/:id").put(restoreBilling);

module.exports = router;
