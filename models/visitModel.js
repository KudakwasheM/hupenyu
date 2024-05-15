const mongoose = require("mongoose");

const visitSchema = mongoose.Schema(
  {
    visit_number: String,
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
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

visitSchema.virtual("prescription", {
  ref: "Prescription",
  localField: "_id",
  foreignField: "visit",
  justOne: true,
});

// Creating visit number
visitSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next(); // If the document is not new, skip generating the visit number
  }

  // Generate the visit number
  let lastVisit = await this.constructor.findOne(
    {},
    {},
    { sort: { visit_number: -1 } }
  );

  let visitNumber = lastVisit
    ? incrementVisitNumber(lastVisit.visit_number)
    : "V090000001";

  this.visit_number = visitNumber;
  next();
});

// Helper function to increment the patient number
function incrementVisitNumber(visitNumber) {
  let number = parseInt(visitNumber.substring(1));
  number++;
  return "V" + number.toString().padStart(9, "0");
}

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
