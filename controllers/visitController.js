const asyncHandler = require("express-async-handler");
const Visit = require("../models/visitModel");
const ErrorResponse = require("../utils/errorResponse");

// Desc     Get visits
// Route    /api/v1/visits
// Route    /api/v1/patients/:patientId/visits
// Access   Private
const getVisits = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//Desc      Get single visit
//Route     GET /api/v1/visits/:id
//Access    Private
const getVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findById(req.params.id).populate({
    path: "patient",
    select: "name",
  });

  if (!visit) {
    return next(
      new ErrorResponse(`Visit with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: visit,
    msg: `Visit ${req.params.id} found`,
  });
});

//Desc      Create visit
//Route     POST /api/v1/visits
//Access    Private
const createVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.create(req.body);
  res.status(201).json({
    success: true,
    data: visit,
    msg: "Successfully created Visit",
  });
});

//Desc      Update visit
//Route     PUT /api/v1/visits/:id
//Access    Private
const updateVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!visit) {
    return next(
      new ErrorResponse(`Visit with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: visit,
    msg: `Updated visit ${req.params.id}`,
  });
});

// Desc      Soft Delete Visit
// Route     PUT /api/v1/visit/delete/:id
// Access    Private
const softDeleteVisit = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const visit = await Visit.findByIdAndUpdate(
    req.params.id,
    { deleted_at: new Date(Date.now()), deleted_by: req.user.name },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: visit,
  });
});

// Desc      Restore visit
// Route     PUT /api/v1/visit/restore/:id
// Access    Private
const restoreVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findByIdAndUpdate(
    req.params.id,
    { deleted_at: null, deleted_by: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: visit,
  });
});
module.exports = {
  getVisits,
  getVisit,
  createVisit,
  updateVisit,
  softDeleteVisit,
  restoreVisit,
};
