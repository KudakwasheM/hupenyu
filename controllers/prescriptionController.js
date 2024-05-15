const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
const Prescription = require("../models/prescriptionModel");
const { Router } = require("express");

// Desc        Get all prescriptions
// Router      GET /api/v1/prescriptions
// Access      Private
const getPrescriptions = asyncHandler(async (req, res, next) => {
  const prescriptions = await Prescription.find()
    .populate({
      path: "patient",
      select: "id name",
    })
    .populate({
      path: "doctor",
      select: "id name",
    })
    .populate({
      path: "visit",
      select: "id",
    });

  res.status(200).json({
    success: true,
    data: prescriptions,
  });
});

// Desc        Get single prescription
// Router      GET /api/v1/prescriptions/:id
// Access      Private
const getPrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate({
      path: "patient",
      select: "id name",
    })
    .populate({
      path: "doctor",
      select: "id name",
    })
    .populate({
      path: "visit",
      select: "id",
    });

  if (!prescription) {
    return next(
      new ErrorResponse(`Prescription with id ${req.params.id} not found`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: prescription,
  });
});

// Desc        Create prescription
// Router      POST /api/v1/prescriptions/:id
// Access      Private
const createPrescription = asyncHandler(async (req, res, next) => {
  const doctor = req.user.id;
  const body = { ...req.body, doctor };
  const prescription = await Prescription.create(body);

  res.status(200).json({
    success: true,
    data: prescription,
  });
});

// Desc      Update Prescription
// Route     PUT /api/v1/prescriptions/:id
// Access    Private
const updatePrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    success: true,
    data: prescription,
  });
});

const updatePrescriptionIndex = asyncHandler(async (req, res, next) => {
  const { medicine, dosage, frequency, days, index } = req.body;
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    return next(
      new ErrorResponse(`Prescription with id ${req.params.id} not found`, 400)
    );
  }

  prescription.medication[index] = {
    medicine,
    dosage,
    frequency,
    days,
    _id: prescription.medication[index]._id,
  };

  await prescription.save();

  res.status(201).json({
    success: true,
    data: prescription,
  });
});

// Desc      Soft Delete Prescription
// Route     PUT /api/v1/prescriptions/delete/:id
// Access    Private
const softDeletePrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findByIdAndUpdate(
    req.params.id,
    { deleted_at: new Date(Date.now()), deleted_by: req.user.name },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: prescription,
  });
});

// Desc      Restore User
// Route     PUT /api/v1/prescription/restore/:id
// Access    Private
const restorePrescription = asyncHandler(async (req, res, next) => {
  const prescription = await Prescription.findByIdAndUpdate(
    req.params.id,
    { deleted_at: null, deleted_by: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: prescription,
  });
});

module.exports = {
  getPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  softDeletePrescription,
  restorePrescription,
};
