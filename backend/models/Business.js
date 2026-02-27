const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: { type: String, required: true },
    gstin: { type: String, required: true, unique: true },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Business", businessSchema);
