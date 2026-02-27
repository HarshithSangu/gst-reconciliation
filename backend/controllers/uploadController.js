const Invoice = require("../models/Invoice");
const { parseExcel } = require("../services/excelParser");
const { uploadToS3, deleteFromS3 } = require("../services/s3Service");

exports.uploadFile = async (req, res) => {
  const { fileType, filingPeriod } = req.body; // fileType: GSTR1 | GSTR2B | GSTR3B
  try {
    const buffer = req.file.buffer;
    const filename = `${req.user._id}-${fileType}-${Date.now()}.xlsx`;

    // Step 1: Upload to S3 temporarily
    const s3Key = await uploadToS3(buffer, filename);

    // Step 2: Parse Excel → JSON
    const invoices = parseExcel(buffer, fileType);

    // Step 3: Attach userId and filingPeriod
    const invoiceDocs = invoices.map((inv) => ({
      ...inv,
      userId: req.user._id,
      filingPeriod: filingPeriod || inv.filingPeriod,
    }));

    // Step 4: Delete old invoices of same type & period, then save new ones
    await Invoice.deleteMany({
      userId: req.user._id,
      source: fileType,
      filingPeriod,
    });
    await Invoice.insertMany(invoiceDocs);

    // Step 5: Delete file from S3
    await deleteFromS3(s3Key);

    res.json({
      message: `${fileType} uploaded and processed`,
      count: invoiceDocs.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
