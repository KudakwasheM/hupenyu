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
  cost: { type: Number },
  payment_method: {
    type: String,
    required: true,
    enum: [
      "Cash",
      "SwipeUSD",
      "SwipeZWL",
      "EcocashZWL",
      "EcocashUSD",
      "MedicalAid",
    ],
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: [true, "Please add the patient"],
  },
});

visitSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "visit",
  justOne: false,
});

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
