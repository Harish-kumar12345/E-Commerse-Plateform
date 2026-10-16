import { describe, it, expect } from 'vitest';
import { isValidGSTIN, isValidPAN, isValidIFSC, isValidPincode } from './validation.js';

describe('Indian Statutory & Compliance Validation', () => {
  it('validates 15-character GSTIN correctly', () => {
    // Valid GSTINs
    expect(isValidGSTIN('27AABCU9603R1ZM')).toBe(true);
    expect(isValidGSTIN('29AABCL3409K1ZX')).toBe(true);
    expect(isValidGSTIN('07AAECU4501F1ZW')).toBe(true);

    // Invalid GSTINs
    expect(isValidGSTIN('INVALIDGST123')).toBe(false);
    expect(isValidGSTIN('27AABCU9603R1Z')).toBe(false); // only 14 chars
    expect(isValidGSTIN('27AABCU9603R1ZMM')).toBe(false); // 16 chars
  });

  it('validates 10-character PAN correctly', () => {
    // Valid PANs
    expect(isValidPAN('AABCU9603R')).toBe(true);
    expect(isValidPAN('AAECU4501F')).toBe(true);

    // Invalid PANs
    expect(isValidPAN('ABC12345')).toBe(false);
    expect(isValidPAN('12345ABCDE')).toBe(false);
  });

  it('validates 11-character Indian Bank IFSC code correctly', () => {
    // Valid IFSCs
    expect(isValidIFSC('HDFC0001234')).toBe(true);
    expect(isValidIFSC('SBIN0004051')).toBe(true);
    expect(isValidIFSC('ICIC0000104')).toBe(true);

    // Invalid IFSCs
    expect(isValidIFSC('HDFC1001234')).toBe(false); // 5th character must be '0'
    expect(isValidIFSC('HDFC0123')).toBe(false); // too short
  });

  it('validates 6-digit Indian PIN code correctly', () => {
    // Valid PIN codes
    expect(isValidPincode('400011')).toBe(true);
    expect(isValidPincode('560038')).toBe(true);
    expect(isValidPincode('110020')).toBe(true);

    // Invalid PIN codes
    expect(isValidPincode('010020')).toBe(false); // Indian PIN cannot start with 0
    expect(isValidPincode('40001')).toBe(false); // only 5 digits
    expect(isValidPincode('4000111')).toBe(false); // 7 digits
    expect(isValidPincode('ABC123')).toBe(false); // alphanumeric
  });
});
