const mongoose = require("mongoose");

const prescriptionSchema = mongoose.Schema(
  {
    prescription_number: {
      type: String,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Please add patient"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    medication: [
      {
        medicine: {
          type: String,
          required: [true, "Medicine is required"],
        },
        dosage: {
          type: String,
        },
        frequency: {
          type: String,
        },
        days: {
          type: String,
        },
      },
    ],
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

prescriptionSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next(); // If the document is not new, skip generating the bill number
  }

  // Generate the bill number
  let lastPres = await this.constructor.findOne(
    {},
    {},
    { sort: { prescription_number: -1 } }
  );

  let presNumber = lastPres
    ? incrementPresNumber(lastPres.prescription_number)
    : "P090000001";

  this.prescription_number = presNumber;
  next();
});

// Helper function to increment the bill number
function incrementPresNumber(presNumber) {
  let number = parseInt(presNumber.substring(1));
  number++;
  return "P" + number.toString().padStart(9, "0");
}

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
