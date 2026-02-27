const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: String },
    supplierGSTIN: { type: String },
    taxableValue: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    totalGST: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ["GSTR1", "GSTR2B", "GSTR3B"],
      required: true,
    },
    filingPeriod: { type: String }, // e.g., "2024-01"
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
