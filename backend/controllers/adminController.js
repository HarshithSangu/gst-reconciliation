const User = require("../models/User");
const ReconciliationResult = require("../models/ReconciliationResult");

exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: "business" }).populate("businessId");
  res.json(users);
};

exports.toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}` });
};

exports.getSystemStats = async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "business" });
  const allResults = await ReconciliationResult.find();
  const totalReconciliations = allResults.length;
  const totalMismatches = allResults.reduce(
    (sum, r) => sum + r.mismatchedCount,
    0,
  );
  const highRiskCount = allResults.filter((r) => r.riskLevel === "High").length;
  res.json({
    totalUsers,
    totalReconciliations,
    totalMismatches,
    highRiskCount,
  });
};
