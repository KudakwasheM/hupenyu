const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
    },
    quantity: {
      type: Number,
      required: [true, "Please add quantity"],
    },
    base: {
      type: Number,
      required: [true, "Please add base"],
    },
    price: {
      type: Number,
      required: [true, "Please add price"],
    },
    batch: {
      type: String,
      required: [true, "Please add batch number"],
    },
    prescription: {
      type: Boolean,
      default: false,
    },
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
  }
);

// Subtract quantity after dispatch
medicineSchema.methods.subtractQuantity = async function (
  medicineId,
  quantityTaken
) {
  this.quantity = this.quantity - quantityTaken;
  await this.model("Medicine").findByIdAndUpdate(medicineId, {
    quantity: this.quantity,
  });
};

// Check for floats after subtraction
medicineSchema.post("subtractQuantity", async function (doc) {
  console.log("Medicine subtracted:", doc);
  // Perform any additional actions or logic here
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
