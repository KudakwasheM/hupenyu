const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    appointment_day: {
      type: String,
      required: [true, "Please add appointment day"],
    },
    start_time: {
      type: String,
      required: [true, "Please add start time"],
    },
    end_time: {
      type: String,
      required: [true, "Please add end time"],
    },
    reason: {
      type: String,
      required: [true],
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient",
      required: [true, "Please add the patient"],
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add doctor"],
    },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
