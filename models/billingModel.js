const mongoose = require("mongoose");

const billingSchema = mongoose.Schema(
  {
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
    rate: Number,
    bill: String,
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

billingSchema.virtual("payments", {
  ref: "Payments",
  localField: "id",
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

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
