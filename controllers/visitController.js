const asyncHandler = require("express-async-handler");
const Visit = require("../models/visitModel");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

// Desc     Get visits
// Route    /api/v1/visits
// Route    /api/v1/patients/:patientId/visits
// Access   Private
const getVisits = asyncHandler(async (req, res, next) => {
  // res.status(200).json(res.advancedResults);
  const visits = await Visit.find()
    .populate({
      path: "patient",
      select: "name",
    })
    .populate({
      path: "doctor",
      select: "name",
    });

  res.status(200).json({
    success: true,
    data: visits,
  });
});

//Desc      Get single visit
//Route     GET /api/v1/visits/:id
//Access    Private
const getVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findById(req.params.id)
    .populate({
      path: "patient",
      select: "name",
    })
    .populate({ path: "doctor", select: "name" });

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
  req.body.doctor = req.user.id;
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

//Desc      Upload files for visit
//Route     PUT /api/v1/visits/:id/files
//Access    Private
const visitFilesUpload = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    return next(
      new ErrorResponse(`Visit with id ${req.params.id} not found`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload file(s)`, 404));
  }

  const files = Array.isArray(req.files.file)
    ? req.files.file
    : [req.files.file];

  // Check file size for each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      );
    }
  }

  // Create custom file name
  const fileNames = [];
  // file.name = `file_${visit._id}${path.parse(file.name).ext}`;
  const crypto = require("crypto");
  const path = require("path");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExtension = path.extname(file.name);
    const uniqueFileName = generateUniqueFileName(fileExtension);

    fileNames.push(uniqueFileName);

    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/visits/${uniqueFileName}`,
      async (err) => {
        if (err) {
          console.error(err);
          return next(`Problem with file upload`, 500);
        }
      }
    );
  }

  function generateUniqueFileName(extension) {
    const randomBytes = crypto.randomBytes(8).toString("hex");
    const uniqueName = `file_${randomBytes}${extension}`;
    return uniqueName;
  }

  await Visit.findByIdAndUpdate(req.params.id, {
    $push: { files: { $each: fileNames } },
  });

  res.status(200).json({
    success: true,
    data: fileNames,
  });
});

module.exports = {
  getVisits,
  getVisit,
  createVisit,
  updateVisit,
  softDeleteVisit,
  restoreVisit,
  visitFilesUpload,
};
