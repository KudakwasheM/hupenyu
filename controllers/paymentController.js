const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const Payment = require("../models/paymentModel");

// Desc     Get All Payments
// Route    /api/v1/payments
// Access   Private
const getPayments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//Desc      Get single Payment
//Route     GET /api/v1/payments/:id
//Access    Private
const getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(
      new ErrorResponse(`Payment with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: payment,
    msg: `Payment ${req.params.id} found`,
  });
});

//Desc      Create payment
//Route     POST /api/v1/payments
//Access    Private
const createPayment = asyncHandler(async (req, res, next) => {
  req.body.created_by = req.user.id;
  const payment = await Payment.create(req.body);
  res.status(201).json({
    success: true,
    data: payment,
    msg: "Successfully created payment",
  });
});

//Desc      Update payment
//Route     PUT /api/v1/payments/:id
//Access    Private
const updatePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!payment) {
    return next(
      new ErrorResponse(`Payment with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: payment,
    msg: `Updated payment ${req.params.id}`,
  });
});

// Desc      Soft Delete payment
// Route     PUT /api/v1/payments/delete/:id
// Access    Private
const softDeletePayment = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { deleted_at: new Date(Date.now()), deleted_by: req.user.name },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: payment,
  });
});

// Desc      Restore payment
// Route     PUT /api/v1/payments/restore/:id
// Access    Private
const restorePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { deleted_at: null, deleted_by: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: payment,
  });
});

module.exports = {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  softDeletePayment,
  restorePayment,
};
