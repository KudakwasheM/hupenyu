const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  notes: { type: String, required: [true, "Please add notes"] },
  visit: {
    type: mongoose.Schema.ObjectId,
    ref: "Visit",
    required: [true, "Please put visit"],
  },
});
