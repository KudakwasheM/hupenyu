const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add service name"] },
    description: String,
    cost: {
      type: Number,
      required: [true, "Please add service price"],
    },
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
