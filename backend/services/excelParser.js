const XLSX = require("xlsx");

const parseExcel = (buffer, fileType) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(sheet);

  return rawData.map((row) => ({
    invoiceNumber: String(row["Invoice Number"] || row["invoice_number"] || ""),
    invoiceDate: String(row["Invoice Date"] || row["invoice_date"] || ""),
    supplierGSTIN: String(row["Supplier GSTIN"] || row["supplier_gstin"] || ""),
    taxableValue: parseFloat(row["Taxable Value"] || row["taxable_value"] || 0),
    igst: parseFloat(row["IGST"] || row["igst"] || 0),
    cgst: parseFloat(row["CGST"] || row["cgst"] || 0),
    sgst: parseFloat(row["SGST"] || row["sgst"] || 0),
    totalGST: parseFloat(row["Total GST"] || row["total_gst"] || 0),
    source: fileType,
    filingPeriod: String(row["Filing Period"] || row["filing_period"] || ""),
  }));
};

module.exports = { parseExcel };
