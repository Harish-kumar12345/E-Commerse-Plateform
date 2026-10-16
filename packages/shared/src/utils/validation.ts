/**
 * Validates 15-character Indian GSTIN format
 * Format: 2 state digits, 10 PAN chars, 1 entity code, 'Z' default, 1 check digit
 */
export function isValidGSTIN(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim().toUpperCase());
}

/**
 * Validates 10-character Indian Permanent Account Number (PAN)
 * Format: 5 uppercase letters, 4 digits, 1 uppercase letter
 */
export function isValidPAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.trim().toUpperCase());
}

/**
 * Validates 11-character Indian Bank IFSC code
 * Format: 4 letters bank code, '0' reserve, 6 alphanumeric branch code
 */
export function isValidIFSC(ifsc: string): boolean {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.trim().toUpperCase());
}

/**
 * Validates 6-digit Indian Postal PIN code
 */
export function isValidPincode(pincode: string): boolean {
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pincode.trim());
}
