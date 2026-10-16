import { describe, it, expect } from 'vitest';
import { calculateGSTFromGross } from './tax.js';

describe('GST Tax Calculation Utilities (India)', () => {
  it('calculates intra-state CGST & SGST correctly for 18% GST', () => {
    // ₹1,180 gross (118000 paise) at 18% => 100000 taxable, 18000 total tax (9000 CGST, 9000 SGST)
    const breakdown = calculateGSTFromGross(118000, 18.0, false);
    expect(breakdown.taxableAmountInPaise).toBe(100000);
    expect(breakdown.totalTaxInPaise).toBe(18000);
    expect(breakdown.cgstInPaise).toBe(9000);
    expect(breakdown.sgstInPaise).toBe(9000);
    expect(breakdown.igstInPaise).toBe(0);
    expect(breakdown.grossAmountInPaise).toBe(118000);
  });

  it('calculates inter-state IGST correctly for 18% GST', () => {
    const breakdown = calculateGSTFromGross(118000, 18.0, true);
    expect(breakdown.taxableAmountInPaise).toBe(100000);
    expect(breakdown.totalTaxInPaise).toBe(18000);
    expect(breakdown.cgstInPaise).toBe(0);
    expect(breakdown.sgstInPaise).toBe(0);
    expect(breakdown.igstInPaise).toBe(18000);
  });

  it('handles 0% exempt categories correctly', () => {
    const breakdown = calculateGSTFromGross(50000, 0, false);
    expect(breakdown.taxableAmountInPaise).toBe(50000);
    expect(breakdown.totalTaxInPaise).toBe(0);
  });
});
