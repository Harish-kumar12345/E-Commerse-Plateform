import { describe, it, expect } from 'vitest';
import { formatPaiseToINR, inrToPaise, paiseToInr, calculateDiscountPercent } from './currency.js';

describe('Currency & Money Utilities (INR)', () => {
  it('formats paise into INR correctly without unnecessary decimal zeros', () => {
    expect(formatPaiseToINR(149900)).toBe('₹1,499');
    expect(formatPaiseToINR(2799000)).toBe('₹27,990');
    expect(formatPaiseToINR(0)).toBe('₹0');
  });

  it('formats fractional paise with 2 decimal places', () => {
    expect(formatPaiseToINR(149950)).toBe('₹1,499.50');
  });

  it('converts INR to Paise and back accurately', () => {
    expect(inrToPaise(1499)).toBe(149900);
    expect(paiseToInr(149900)).toBe(1499);
  });

  it('calculates correct discount percentage', () => {
    // 2499 -> 1499 is 40% off
    expect(calculateDiscountPercent(249900, 149900)).toBe(40);
    // No compareAt or lower price returns 0
    expect(calculateDiscountPercent(null, 149900)).toBe(0);
    expect(calculateDiscountPercent(100000, 150000)).toBe(0);
  });
});
