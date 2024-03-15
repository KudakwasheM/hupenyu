const mongoose = require("mongoose");

const visitSchema = mongoose.Schema(
  {
    purpose: {
      type: String,
      required: [true, "Please add visit purpose"],
    },
    notes: {
      type: String,
      required: [true, "Please add notes"],
    },
    files: {
      type: [String],
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient",
      required: [true, "Please add the patient"],
    },
  },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
