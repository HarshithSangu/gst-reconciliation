const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { roleCheck } = require("../middleware/roleCheck");
const {
  runReconciliation,
  getResults,
} = require("../controllers/reconciliationController");

router.post("/run", protect, roleCheck("business"), runReconciliation);
router.get("/results", protect, roleCheck("business"), getResults);

module.exports = router;
