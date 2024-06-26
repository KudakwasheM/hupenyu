const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Desc      Get all Users
// Route     GET /api/v1/users
// Access    Private
const getUsers = asyncHandler(async (req, res, next) => {
  // res.status(200).json(res.advancedResults);
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: "Users found successfully",
    data: users,
  });
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
    { deleted_at: new Date(Date.now()), deleted_by: req.user.name },
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
    { deleted_at: null, deleted_by: null },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: user,
  });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  softDeleteUser,
  restoreUser,
};
