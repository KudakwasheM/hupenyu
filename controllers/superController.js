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
// Route     DELETE /api/v1/users/:id
// Access    Private
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({
    success: true,
    data: {},
  });
});

module.exports = { deletePatient, deleteUser };
