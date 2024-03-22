const mongoose = require("mongoose");

const visitSchema = mongoose.Schema(
  {
    symptoms: {
      type: String,
      required: [true, "Please add symptoms"],
    },
    diagnosis: {
      type: String,
      required: [true, "Please add diagnosis"],
    },
    treatment: {
      type: String,
      required: [true, "Please add treatment"],
    },
    progress_notes: {
      type: String,
      required: [true, "Please add treatment"],
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

// visitSchema.virtual("payments", {
//   ref: "Payment",
//   localField: "_id",
//   foreignField: "visit",
//   justOne: false,
// });

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
