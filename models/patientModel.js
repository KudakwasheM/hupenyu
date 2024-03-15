const mongoose = require("mongoose");

const patientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add patient name"],
      minlength: [4, "Name can not be less than 4 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      match: [/^\+263\d{9}$/, "Please add a valid phone number"],
      required: [true, "Please add patient phone number"],
    },
    gender: {
      type: String,
      required: [true, "Please add patient's gender"],
      enum: ["male", "female", "other"],
    },
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
  }
);

patientSchema.virtual("visits", {
  ref: "Visit",
  localField: "_id",
  foreignField: "patient",
  justOne: false,
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
