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
    temperature: Number,
    bp: String,
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

module.exports = Queue;
