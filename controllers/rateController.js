const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Rate = require("../models/rateModel");
const ErrorResponse = require("../utils/errorResponse");

// Route    GET /api/v1/rates/:id
// Desc     Get single rates
// Access   Private
const getRate = asyncHandler(async (req, res, next) => {
  const rate = await Rate.findById(req.params.id);

  if (!rate) {
    return next(
      new ErrorResponse(`Rate with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: rate,
  });
});

// Route    POST /api/v1/rates
// Desc     Create rate
// Access   Private
const createRate = asyncHandler(async (req, res, next) => {
  const rate = await Rate.create(req.body);

  res.status(201).json({
    success: true,
    data: rate,
  });
});

// Route    POST /api/v1/rates/:id
// Desc     Update rate
// Access   Private
const updateRate = asyncHandler(async (req, res, next) => {
  const rate = await Rate.findByIdAndUpdate(req.params.id, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: rate,
  });
});

module.exports = { getRate, createRate, updateRate };
