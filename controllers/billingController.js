const asyncHandler = require("express-async-handler");
const Billing = require("../models/billingModel");
const ErrorResponse = require("../utils/errorResponse");
const { makeInvoice } = require("../utils/generateBill");

// Desc      Get all billings
// Route     GET /api/v1/billings
// Access    Private
const getBillings = asyncHandler(async (req, res, next) => {
  // res.status(200).json(res.advancedResults);
  const bills = await Billing.find()
    .populate({ path: "patient" })
    .populate({ path: "payments" });

  res.status(200).json({
    success: true,
    data: bills,
  });
});

// Desc      Get single billing
// Route     GET /api/v1/billings/:id
// Access    Private
const getBilling = asyncHandler(async (req, res, next) => {
  const billing = await Billing.findById(req.params.id)
    .populate({ path: "payments", select: "amount currency" })
    .populate({ path: "patient" });

  if (!billing) {
    return next(
      new ErrorResponse(`Billing with id ${req.params.id} not found`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: billing,
  });
});

// Desc      Create billing
// Route     POST /api/v1/billings
// Access    Private
const createBilling = asyncHandler(async (req, res, next) => {
  const billing = await Billing.create(req.body);

  if (billing) {
    makeInvoice(billing);
  }

  res.status(201).json({
    success: true,
    data: billing,
  });
});

// Desc      Update billing
// Route     PUT /api/v1/billings/:id
// Access    Private
const updateBilling = asyncHandler(async (req, res, next) => {
  const bill = await Billing.findById(req.params.id);

  if (bill.paymentStatus === "paid") {
    return next(new ErrorResponse(`Cannot edit paid bill`, 400));
  }

  const updatedBilling = await Billing.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  makeInvoice(updatedBilling);

  res.status(201).json({
    success: true,
    data: updatedBilling,
  });
});

// Desc      Soft Delete billing
// Route     PUT /api/v1/billings/delete/:id
// Access    Private
const softDeleteBilling = asyncHandler(async (req, res, next) => {
  const billing = await Billing.findByIdAndUpdate(
    req.params.id,
    { deleted_at: new Date(Date.now()), deleted_by: req.user.name },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: billing,
  });
});

// Desc      Restore billing
// Route     PUT /api/v1/billings/restore/:id
// Access    Private
const restoreBilling = asyncHandler(async (req, res, next) => {
  const billing = await Billing.findByIdAndUpdate(
    req.params.id,
    { deleted_at: null, deleted_by: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: billing,
  });
});

module.exports = {
  getBillings,
  getBilling,
  createBilling,
  updateBilling,
  softDeleteBilling,
  restoreBilling,
};
