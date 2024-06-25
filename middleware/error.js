const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //Log to console for dev
  console.log(err);

  console.error(err.model);

  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = new ErrorResponse(
      `Resource with id ${err.value} not found`,
      404
    );
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    console.log(err.keyValue);
    // console.log(Object.keys(err.keyValue)[0]);
    // const message = "Duplicate field value entered";
    const message = `${Object.keys(err.keyValue)[0]} already exists`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
