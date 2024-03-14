const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Desc      Get all Users
// Route     GET /api/v1/users
// Access    Private
const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Desc      Get single User
// Route     GET /api/v1/users/:id
// Access    Private
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User with id ${req.params.id} not found`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Desc      Create User
// Route     POST /api/v1/users
// Access    Private
const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Desc      Update User
// Route     PUT /api/v1/users/:id
// Access    Private
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Desc      Soft Delete User
// Route     PUT /api/v1/users/delete/:id
// Access    Private
const softDeleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { deleted_at: new Date(Date.now()) },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Desc      Restore User
// Route     PUT /api/v1/users/restore/:id
// Access    Private
const restoreUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { deleted_at: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Desc      Delete User                  To be implemented in SuperController
// Route     DELETE /api/v1/users/:id
// Access    Private
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({
    success: true,
    data: {},
  });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  softDeleteUser,
  restoreUser,
};
