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
      required: true,
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
        unit_price: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["paid", "outstanding"],
      default: "outstanding",
    },
    total: Number,
    amount_paid: Number,
    amount_due: Number,
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

billingSchema.virtual("payments", {
  ref: "Payment", // Assuming the model name is "Payment" instead of "Payments"
  localField: "_id", // Use "_id" instead of "id"
  foreignField: "billing",
  justOne: false,
});

// Calculate total price of items on bill and update payment status
billingSchema.pre("save", function (next) {
  let total = 0;

  this.services_medicine.forEach((s) => {
    total += s.quantity * s.unit_price;
  });

  this.total = total;
  this.amount_due = total;
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
    : "B090000000";

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
