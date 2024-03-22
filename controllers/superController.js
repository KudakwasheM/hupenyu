const expressAsyncHandler = require("express-async-handler");

//Desc      Delete patient
//Route     DELETE /api/v1/delete/:patientId/patients
//Access    Private
const deletePatient = expressAsyncHandler(async (req, res, next) => {
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

// Desc      Delete User
// Route     DELETE /api/v1/delete/:userId/users
// Access    Private
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({
    success: true,
    data: {},
  });
});

//Desc      Delete visit
//Route     DELETE /api/v1/delete/:visitId/visits
//Access    Private
const deleteVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    return next(
      new ErrorResponse(`Visit with id ${req.params.id} not found`, 404)
    );
  }

  visit.deleteOne({ _id: visit._id });
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted visit ${req.params.id}`,
  });
});

module.exports = { deletePatient, deleteUser, deleteVisit };
