const mongoose = require("mongoose");
const Billing = require("./billingModel");
const Rate = require("./rateModel");
const ErrorResponse = require("../utils/errorResponse");

const paymentSchema = mongoose.Schema(
  {
    receipt_number: String,
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
    created_by: { type: mongoose.Schema.ObjectId, ref: "User" },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next(); // If the document is not new, skip generating the receipt number
  }

  // Generate the receipt number
  let lastReceipt = await this.constructor.findOne(
    {},
    {},
    { sort: { receipt_number: -1 } }
  );

  let receiptNumber = lastReceipt
    ? incrementReceiptNumber(lastReceipt.receipt_number)
    : "R090000001";

  this.receipt_number = receiptNumber;
});

paymentSchema.pre("save", async function (next) {
  try {
    let bill = await Billing.findById(this.bill);
    const rate = await Rate.findOne().sort({ createdAt: -1 });

    let balance = 0;
    let paidAmount = 0;
    let ratedAmount = 0;

    if (!bill) {
      // No bill found, stop the save operation
      const error = new ErrorResponse(`Bill with ${this.bill} not found`, 404);
      return next(error);
    }

    // Convert the bill amount and rate amount to numbers
    const billAmount = Number(bill.total);
    paidAmount = Number(bill.amount_paid);
    const rateAmount = Number(rate.amount);

    if (this.currency === bill.currency) {
      // Same currency
      paidAmount += Number(this.amount);
      balance = billAmount - paidAmount;
    } else if (this.currency === "USD" && bill.currency === "ZiG") {
      // USD to ZiG conversion
      ratedAmount = rateAmount * Number(this.amount);
      paidAmount += ratedAmount;
      balance = billAmount - paidAmount;
    } else if (this.currency === "ZiG" && bill.currency === "USD") {
      // ZiG to USD conversion
      ratedAmount = Number(this.amount) / rateAmount;
      paidAmount += ratedAmount;
      balance = billAmount - paidAmount;
    }

    this.bill_amount = billAmount;

    if (balance <= 0) {
      bill.paymentStatus = "paid";
    }

    // Update the billing document
    const updated = (bill = await Billing.findByIdAndUpdate(
      this.bill,
      {
        amount_due: balance,
        amount_paid: paidAmount,
        paymentStatus: bill.paymentStatus,
      },
      { new: true }
    ));
    console.log(updated);

    next();
  } catch (err) {
    next(err);
  }
});

// Helper function to increment the patient number
function incrementReceiptNumber(receiptNumber) {
  let number = parseInt(receiptNumber.substring(1));
  number++;
  return "R" + number.toString().padStart(9, "0");
}

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
