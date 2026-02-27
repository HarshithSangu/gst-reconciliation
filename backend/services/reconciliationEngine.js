/**
 * RECONCILIATION ENGINE
 * Matches GSTR-1 invoices against GSTR-2B invoices
 * Assigns MATCHED / MISMATCHED / MISSING status
 * Calculates ITC difference and overall risk level
 */

const runReconciliation = (gstr1Invoices, gstr2bInvoices) => {
  const results = [];
  let totalITCDifference = 0;

  // Build a lookup map from GSTR-2B using invoice number as key
  const gstr2bMap = {};
  gstr2bInvoices.forEach((inv) => {
    gstr2bMap[inv.invoiceNumber] = inv;
  });

  // Evaluate each GSTR-1 invoice
  gstr1Invoices.forEach((gstr1Inv) => {
    const gstr2bInv = gstr2bMap[gstr1Inv.invoiceNumber];

    if (!gstr2bInv) {
      // Invoice present in GSTR-1 but missing in GSTR-2B
      results.push({
        invoiceNumber: gstr1Inv.invoiceNumber,
        status: "MISSING",
        gstr1TaxableValue: gstr1Inv.taxableValue,
        gstr2bTaxableValue: 0,
        gstr1GST: gstr1Inv.totalGST,
        gstr2bGST: 0,
        discrepancy: gstr1Inv.totalGST,
        riskFlag: "High",
      });
      totalITCDifference += gstr1Inv.totalGST;
      return;
    }

    // Compare values (allow ₹1 tolerance for rounding)
    const taxableDiff = Math.abs(
      gstr1Inv.taxableValue - gstr2bInv.taxableValue,
    );
    const gstDiff = Math.abs(gstr1Inv.totalGST - gstr2bInv.totalGST);
    const TOLERANCE = 1;

    if (taxableDiff <= TOLERANCE && gstDiff <= TOLERANCE) {
      results.push({
        invoiceNumber: gstr1Inv.invoiceNumber,
        status: "MATCHED",
        gstr1TaxableValue: gstr1Inv.taxableValue,
        gstr2bTaxableValue: gstr2bInv.taxableValue,
        gstr1GST: gstr1Inv.totalGST,
        gstr2bGST: gstr2bInv.totalGST,
        discrepancy: 0,
        riskFlag: "None",
      });
    } else {
      // Assign risk level based on discrepancy size
      let riskFlag = "Low";
      if (gstDiff > 10000) riskFlag = "High";
      else if (gstDiff > 1000) riskFlag = "Medium";

      results.push({
        invoiceNumber: gstr1Inv.invoiceNumber,
        status: "MISMATCHED",
        gstr1TaxableValue: gstr1Inv.taxableValue,
        gstr2bTaxableValue: gstr2bInv.taxableValue,
        gstr1GST: gstr1Inv.totalGST,
        gstr2bGST: gstr2bInv.totalGST,
        discrepancy: gstDiff,
        riskFlag,
      });
      totalITCDifference += gstDiff;
    }

    // Remove processed entry from map
    delete gstr2bMap[gstr1Inv.invoiceNumber];
  });

  // Summary statistics
  const matched = results.filter((r) => r.status === "MATCHED").length;
  const mismatched = results.filter((r) => r.status === "MISMATCHED").length;
  const missing = results.filter((r) => r.status === "MISSING").length;

  // Overall risk level
  const highCount = results.filter((r) => r.riskFlag === "High").length;
  const mediumCount = results.filter((r) => r.riskFlag === "Medium").length;
  let overallRisk = "Low";
  if (highCount > 0) overallRisk = "High";
  else if (mediumCount > 2) overallRisk = "Medium";

  return {
    totalInvoices: gstr1Invoices.length,
    matchedCount: matched,
    mismatchedCount: mismatched,
    missingInGSTR2B: missing,
    itcDifference: totalITCDifference,
    riskLevel: overallRisk,
    details: results,
  };
};

module.exports = { runReconciliation };
