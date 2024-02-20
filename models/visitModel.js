const mongoose = require("mongoose");

const visitSchema = mongoose.Schema({
  purpose: {
    type: String,
    required: [true, "Please add visit purpose"],
  },
  date: {
    type: Date,
    required: [true, "Please add visit date"],
  },
  payment_method: {
    type: String,
    required: true,
    enum: [
      "Cash",
      "Swipe USD",
      "Swipe ZWL",
      "Ecocash ZWL",
      "Ecocash USD",
      "Medical Aid",
    ],
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: [true, "Please add the patient"],
  },
});

visitSchema.virtual("notes", {
  ref: "Notes",
  localField: "_id",
  foreignField: "visit",
  justOne: false,
});

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
