const asyncHandler = require("express-async-handler");
const Visit = require("../models/visitModel");

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
  const visit = await Visit.findById(req.params.id);

  if (!Visit) {
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

//Desc      Delete visit
//Route     DELETE /api/v1/visits/:id
//Access    Private
const deleteVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    return next(
      new ErrorResponse(`Visit with id ${req.params.id} not found`, 404)
    );
  }

  visit.remove();
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted visit ${req.params.id}`,
  });
});

module.exports = { getVisits, getVisit, createVisit, updateVisit, deleteVisit };
