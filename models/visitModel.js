const mongoose = require("mongoose");

const visitSchema = mongoose.Schema(
  {
    symptoms: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    treatment: {
      type: String,
    },
    progress_notes: {
      type: String,
    },
    files: {
      type: [String],
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
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
