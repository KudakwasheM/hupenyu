const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please add visit date"],
  },
  amount: { type: Number, required: [true, "Please add amount"] },
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
  currency: {
    type: String,
    required: true,
    enum: ["USD", "ZWL"],
  },
  // visit: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Visit",
  //   required: [true, "Please add the visit"],
  // },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
