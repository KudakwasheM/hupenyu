const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const Patient = require("../models/patientModel");

// Desc     Get All Patients
// Route    /api/v1/patients
// Access   Private
const getPatients = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//Desc      Get single patient
//Route     GET /api/v1/patients/:id
//Access    Private
const getPatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    return next(
      new ErrorResponse(`Patient with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: patient,
    msg: `Patient ${req.params.id} found`,
  });
});

//Desc      Create patient
//Route     POST /api/v1/patients
//Access    Private
const createPatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.create(req.body);
  res.status(201).json({
    success: true,
    data: patient,
    msg: "Successfully created patient",
  });
});

//Desc      Update patient
//Route     PUT /api/v1/patients/:id
//Access    Private
const updatePatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!patient) {
    return next(
      new ErrorResponse(`Patient with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: patient,
    msg: `Updated patient ${req.params.id}`,
  });
});

//Desc      Delete patient
//Route     DELETE /api/v1/patients/:id
//Access    Private
const deletePatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    return next(
      new ErrorResponse(`Patient with id ${req.params.id} not found`, 404)
    );
  }

  patient.remove();
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted patient ${req.params.id}`,
  });
});

module.exports = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
};
