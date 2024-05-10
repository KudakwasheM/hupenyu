const mongoose = require("mongoose");

const queueSchema = mongoose.Schema(
  {
    patients: [
      {
        patient_id: String,
        name: String,
        gender: String,
        position: Number,
        attended: {
          type: Boolean,
          default: false,
        },
      },
    ],
    visits: Number,
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

module.exports = Queue;
