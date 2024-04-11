const mongoose = require("mongoose");
const Rate = require("./rateModel");

const serviceSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add service name"] },
    usd_price: { type: Number, required: [true, "Please add usd price"] },
    zig_price: Number,
    unit_size: { type: Number, required: true },
    description: String,
    created_by: { type: String, required: [true, "Please add creator"] },
    deleted_at: Date,
    deleted_by: String,
  },
  {
    timestamps: true,
  }
);

serviceSchema.pre("save", async function (next) {
  let usd = this.usd_price;
  let zig = 0;

  const rate = await Rate.findOne({}, {}, { sort: { created_at: -1 } });
  zig = rate.amount * usd;
  this.zig_price = zig;
  next();
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
