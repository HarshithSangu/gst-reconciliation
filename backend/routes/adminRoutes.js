const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { roleCheck } = require("../middleware/roleCheck");
const {
  getAllUsers,
  toggleUserStatus,
  getSystemStats,
} = require("../controllers/adminController");

router.get("/users", protect, roleCheck("admin"), getAllUsers);
router.patch(
  "/users/:id/toggle",
  protect,
  roleCheck("admin"),
  toggleUserStatus,
);
router.get("/stats", protect, roleCheck("admin"), getSystemStats);

module.exports = router;
