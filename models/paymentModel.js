const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Please add visit date"],
    },
    bill_amount: {
      type: Number,
      required: [true, "Please add bill amount"],
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
    billing: {
      type: mongoose.Schema.ObjectId,
      ref: "Billing",
    },
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
