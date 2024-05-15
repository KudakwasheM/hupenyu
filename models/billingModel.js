const mongoose = require("mongoose");

const billingSchema = mongoose.Schema(
  {
    bill_number: {
      type: String,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Please add patient"],
    },
    services_medicine: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        unit_size: { type: Number },
        unit_price: {
          type: Number,
          required: true,
        },
        amount: Number,
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["paid", "outstanding"],
      default: "outstanding",
    },
    currency: { type: String, enum: ["ZiG", "USD"], required: true },
    total: Number,
    amount_paid: { type: Number, default: 0 },
    amount_due: Number,
    draft: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

billingSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "bill",
  justOne: false,
});

// Calculate total price of items on bill and update payment status
billingSchema.pre("save", function (next) {
  let total = 0;

  this.services_medicine.forEach((s) => {
    total += s.quantity * s.unit_price;
  });

  this.total = total;
  this.amount_due = total - this.amount_paid;
  this.amount_paid = total - this.amount_due;
  this.paymentStatus = this.amount_due <= 0 ? "paid" : "outstanding";

  next();
});

// Define the pre-save middleware
billingSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next(); // If the document is not new, skip generating the bill number
  }

  // Generate the bill number
  let lastBill = await this.constructor.findOne(
    {},
    {},
    { sort: { bill_number: -1 } }
  );

  let billNumber = lastBill
    ? incrementBillNumber(lastBill.bill_number)
    : "B090000001";

  this.bill_number = billNumber;
  next();
});

// Helper function to increment the bill number
function incrementBillNumber(billNumber) {
  let number = parseInt(billNumber.substring(1));
  number++;
  return "B" + number.toString().padStart(9, "0");
}

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
