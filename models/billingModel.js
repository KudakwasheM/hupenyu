const mongoose = require("mongoose");

const billingSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    services: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
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
  ref: "Payments",
  localField: "id",
  foreignField: "billing",
  justOne: false,
});

// Calculate total price of items on bill and update payment status
billingSchema.pre("save", async function () {
  let total = 0;

  this.services.map((s) => {
    total += s.price;
  });
  this.total = total;
  this.amount_due = total;

  if (this.amount_due <= 0) {
    this.paymentStatus = "paid";
  }
});

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
