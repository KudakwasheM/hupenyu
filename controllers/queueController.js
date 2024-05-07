const asyncHandler = require("express-async-handler");
const Queue = require("../models/queueModel");
const { Router } = require("express");
const ErrorResponse = require("../utils/errorResponse");

// Desc         Get all queues
// Router       GET /api/v1/queues
// Access       Private
const getQueues = asyncHandler(async (req, res, next) => {
  try {
    const queues = await Queue.find();

    res.status(200).json({
      success: true,
      data: queues,
    });
  } catch (err) {
    return next(new ErrorResponse(`Something went wrong`, 404));
  }
});

// Desc         Get single queue
// Router       GET /api/v1/queues/:id
// Access       Private
const getQueue = asyncHandler(async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return next(new ErrorResponse(`Queue does not exist`, 404));
    }

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (err) {
    return next(new ErrorResponse(`Failed to get queue`, 404));
  }
});

// Desc         Get current queue
// Router       GET /api/v1/queues/today
// Access       Private
const getTodayQueue = asyncHandler(async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const queue = await Queue.find({ createdAt: { $gte: today } });

    if (!queue) {
      return next(new ErrorResponse(`No queue created today`, 404));
    }

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (err) {
    return next(new ErrorResponse(`Failed to get queue`, 404));
  }
});

// Desc         Get unattended patients in queue
// Router       PUT /api/v1/queues/today/unattended
// Access       Private
const getTodayUnattended = asyncHandler(async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const queue = await Queue.findOne({ createdAt: { $gte: today } });

    if (!queue) {
      return next(new ErrorResponse(`No queue created today`, 404));
    }

    const patientsToAttend = queue.patients.filter(
      (patient) => !patient.attended
    );

    res.status(200).json({
      success: true,
      data: patientsToAttend,
    });
  } catch (err) {
    return next(new ErrorResponse(`Failed to get queue`, 404));
  }
});

// Desc         Create/Update queue
// Router       PUT /api/v1/queues
// Access       Private
const createQueue = asyncHandler(async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let queue = await Queue.findOne({ createdAt: { $gte: today } });

    if (!queue) {
      queue = await Queue.create(req.body);
      queue.visits = 1;
    } else {
      queue.visits += 1;
    }

    const position = queue.visits;
    const patient = { ...req.body, position };
    queue.patients.push(patient);
    await queue.save();

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (err) {
    return next(new ErrorResponse(`Failed to get queue`, 404));
  }
});

// Desc         Update daily queue
// Router       PUT /api/v1/queues/today
// Access       Private
const updateQueue = asyncHandler(async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const queue = await Queue.findOne({ createdAt: { $gte: today } });

    if (!queue) {
      return next(new ErrorResponse(`Queue does not exist`, 404));
    }

    const { position, attended } = req.body;
    const patients = queue.patients;

    const patientToUpdate = patients.find(
      (patient) => patient.position === position
    );

    if (patientToUpdate) {
      patientToUpdate.attended = attended;
      await queue.save();

      return res.status(200).json({
        success: true,
        data: queue,
      });
    } else {
      return next(new ErrorResponse(`Invalid position`, 404));
    }
  } catch (err) {
    return next(new ErrorResponse(`Something went wrong`, 500));
  }
});

// Desc         Attend patient in queue
// Router       PUT /api/v1/queues/attend
// Access       Private
const attendPatient = asyncHandler(async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const queue = await Queue.findOne({ createdAt: { $gte: today } });

    if (!queue) {
      return next(new ErrorResponse(`Queue does not exist`, 404));
    }

    const { position, attended } = req.body;
    const patients = queue.patients;

    const patientToUpdate = patients.find(
      (patient) => patient.position === position
    );

    if (patientToUpdate) {
      patientToUpdate.attended = attended;
      await queue.save();

      return res.status(200).json({
        success: true,
        data: queue,
      });
    } else {
      return next(new ErrorResponse(`Invalid position`, 404));
    }
  } catch (err) {
    return next(new ErrorResponse(`Something went wrong`, 500));
  }
});

module.exports = {
  getQueues,
  getQueue,
  getTodayQueue,
  getTodayUnattended,
  createQueue,
  updateQueue,
  attendPatient,
};
