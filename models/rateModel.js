const mongoose = require("mongoose");

const rateSchema = mongoose.Schema({
  amount: { type: Number, required: [true, "Please add the rate"] },
});

const Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
