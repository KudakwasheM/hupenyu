const mongoose = require("mongoose");
const Billing = require("./billingModel");
const Rate = require("./rateModel");
const ErrorResponse = require("../utils/errorResponse");

const paymentSchema = mongoose.Schema(
  {
    bill_amount: {
      type: Number,
    },
    amount: { type: Number, required: [true, "Please add amount"] },
    payment_method: {
      type: String,
      required: true,
      enum: [
        "Cash",
        "SwipeUSD",
        "SwipeZiG",
        "EcocashZiG",
        "EcocashUSD",
        "MedicalAid",
      ],
    },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "ZiG"],
    },
    bill: {
      type: mongoose.Schema.ObjectId,
      ref: "Billing",
    },
    created_by: { type: mongoose.Schema.ObjectId, ref: "Billing" },
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre("save", async function (next) {
  console.log("Tapinda");
  try {
    let bill = await Billing.findById(this.bill);
    const rate = await Rate.findOne().sort({ createdAt: -1 });

    let balance = 0;
    let paidAmount = 0;
    let ratedAmount = 0;

    if (!bill) {
      // No bill found, stop the save operation
      console.log("Bill hapana");
      const error = new ErrorResponse(`Bill with ${this.bill} not found`, 404);
      return next(error);
    }

    // Convert the bill amount and rate amount to numbers
    const billAmount = Number(bill.total);
    const rateAmount = Number(rate.amount);

    if (this.currency === bill.currency) {
      // Same currency
      paidAmount = billAmount + Number(this.amount);
      balance = paidAmount - Number(this.amount);
    } else if (this.currency === "USD" && bill.currency === "ZiG") {
      // USD to ZiG conversion
      ratedAmount = rateAmount * Number(this.amount);
      paidAmount = billAmount - ratedAmount;
      balance = paidAmount - Number(this.amount);
    } else if (this.currency === "ZiG" && bill.currency === "USD") {
      // ZiG to USD conversion
      ratedAmount = Number(this.amount) / rateAmount;
      paidAmount = billAmount - ratedAmount;
      balance = paidAmount - Number(this.amount);
    }

    this.bill_amount = billAmount;

    if (balance <= 0) {
      bill.paymentStatus = "paid";
    }

    // Update the billing document
    bill = await Billing.findByIdAndUpdate(
      this.bill,
      {
        amount_due: balance,
        amount_paid: paidAmount,
        paymentStatus: bill.paymentStatus,
      },
      { new: true }
    );
    next();
  } catch (err) {
    next(err);
  }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
