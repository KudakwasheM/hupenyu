const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Service = require("../models/serviceModel");
const ErrorResponse = require("../utils/errorResponse");

// Route    GET /api/v1/services
// Desc     Get all services
// Access   Private
const getServices = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Route    GET /api/v1/services/:id
// Desc     Get single services
// Access   Private
const getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(
      new ErrorResponse(`Service with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

// Route    POST /api/v1/services
// Desc     Create service
// Access   Private
const createService = asyncHandler(async (req, res, next) => {
  req.body.created_by = req.user.name;
  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: service,
  });
});

// Route    POST /api/v1/services/:id
// Desc     Update service
// Access   Private
const updateService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: service,
  });
});

// Desc      Soft Delete Service
// Route     PUT /api/v1/services/delete/:id
// Access    Private
const softDeleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { deleted_at: new Date(Date.now()), deleted_by: req.user.name },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: service,
  });
});

// Desc      Restore Service
// Route     PUT /api/v1/services/restore/:id
// Access    Private
const restoreService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { deleted_at: null, deleted_by: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: service,
  });
});

module.exports = {
  getServices,
  getService,
  createService,
  createService,
  updateService,
  softDeleteService,
  restoreService,
};
