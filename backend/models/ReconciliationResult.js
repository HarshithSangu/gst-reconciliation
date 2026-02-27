const mongoose = require("mongoose");

const reconciliationResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filingPeriod: { type: String, required: true },
    totalInvoices: { type: Number, default: 0 },
    matchedCount: { type: Number, default: 0 },
    mismatchedCount: { type: Number, default: 0 },
    missingInGSTR2B: { type: Number, default: 0 },
    itcDifference: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    details: [
      {
        invoiceNumber: String,
        status: { type: String, enum: ["MATCHED", "MISMATCHED", "MISSING"] },
        gstr1TaxableValue: Number,
        gstr2bTaxableValue: Number,
        gstr1GST: Number,
        gstr2bGST: Number,
        discrepancy: Number,
        riskFlag: String,
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "ReconciliationResult",
  reconciliationResultSchema,
);
