const mongoose = require("mongoose");

const rateSchema = mongoose.Schema(
  {
    amount: { type: Number, required: [true, "Please add the rate"] },
  },
  {
    timestamps: true,
  }
);

const Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
