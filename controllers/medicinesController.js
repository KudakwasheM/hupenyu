const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
const Medicine = require("../models/medicineModel");

// Desc      Get all medicines
// Route     GET /api/v1/medicines
// Access    Private
const getMedicines = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Desc      Get single medicine
// Route     GET /api/v1/medicines/:id
// Access    Private
const getMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    return next(
      new ErrorResponse(`medicine with id ${req.params.id} not found`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: medicine,
  });
});

// Desc      Create medicine
// Route     POST /api/v1/medicines
// Access    Private
const createMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.create(req.body);

  res.status(201).json({
    success: true,
    data: medicine,
  });
});

// Desc      Update medicine
// Route     PUT /api/v1/medicines/:id
// Access    Private
const updateMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: medicine,
  });
});

// Desc      Soft Delete medicine
// Route     PUT /api/v1/medicines/delete/:id
// Access    Private
const softDeleteMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    { deleted_at: new Date(Date.now()), deleted_by: req.medicine.name },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: medicine,
  });
});

// Desc      Restore medicine
// Route     PUT /api/v1/medicines/restore/:id
// Access    Private
const restoreMedicine = asyncHandler(async (req, res, next) => {
  const medicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    { deleted_at: null, deleted_by: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: medicine,
  });
});

module.exports = {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  softDeleteMedicine,
  restoreMedicine,
};
