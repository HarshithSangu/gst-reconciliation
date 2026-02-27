const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/auth");
const { roleCheck } = require("../middleware/roleCheck");
const { uploadFile } = require("../controllers/uploadController");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  protect,
  roleCheck("business"),
  upload.single("file"),
  uploadFile,
);

module.exports = router;
