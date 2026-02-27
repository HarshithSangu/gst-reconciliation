const Invoice = require("../models/Invoice");
const ReconciliationResult = require("../models/ReconciliationResult");
const { runReconciliation } = require("../services/reconciliationEngine");

exports.runReconciliation = async (req, res) => {
  const { filingPeriod } = req.body;
  try {
    const gstr1 = await Invoice.find({
      userId: req.user._id,
      source: "GSTR1",
      filingPeriod,
    });
    const gstr2b = await Invoice.find({
      userId: req.user._id,
      source: "GSTR2B",
      filingPeriod,
    });

    if (!gstr1.length || !gstr2b.length) {
      return res
        .status(400)
        .json({ message: "Please upload both GSTR-1 and GSTR-2B files first" });
    }

    const result = runReconciliation(gstr1, gstr2b);

    // Save result (upsert by userId + filingPeriod)
    const saved = await ReconciliationResult.findOneAndUpdate(
      { userId: req.user._id, filingPeriod },
      { ...result, userId: req.user._id, filingPeriod },
      { upsert: true, new: true },
    );

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await ReconciliationResult.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
