/**
 * GST (Goods and Services Tax) calculation utilities for India.
 * Default standard GST rate is 18%, Electronics usually 18%, Books 0%, Apparel 5-12%.
 */

export interface GSTBreakdown {
  taxableAmountInPaise: number;
  totalTaxInPaise: number;
  cgstInPaise: number;
  sgstInPaise: number;
  igstInPaise: number;
  grossAmountInPaise: number;
  taxRatePercent: number;
}

export function calculateGSTFromGross(grossAmountInPaise: number, taxRatePercent: number, isInterState: boolean = false): GSTBreakdown {
  if (taxRatePercent <= 0) {
    return {
      taxableAmountInPaise: grossAmountInPaise,
      totalTaxInPaise: 0,
      cgstInPaise: 0,
      sgstInPaise: 0,
      igstInPaise: 0,
      grossAmountInPaise,
      taxRatePercent: 0,
    };
  }

  // Gross = Taxable * (1 + rate/100) => Taxable = Gross / (1 + rate/100)
  const taxable = Math.round(grossAmountInPaise / (1 + taxRatePercent / 100));
  const totalTax = grossAmountInPaise - taxable;

  if (isInterState) {
    return {
      taxableAmountInPaise: taxable,
      totalTaxInPaise: totalTax,
      cgstInPaise: 0,
      sgstInPaise: 0,
      igstInPaise: totalTax,
      grossAmountInPaise,
      taxRatePercent,
    };
  } else {
    const halfTax = Math.round(totalTax / 2);
    return {
      taxableAmountInPaise: taxable,
      totalTaxInPaise: totalTax,
      cgstInPaise: halfTax,
      sgstInPaise: totalTax - halfTax,
      igstInPaise: 0,
      grossAmountInPaise,
      taxRatePercent,
    };
  }
}
