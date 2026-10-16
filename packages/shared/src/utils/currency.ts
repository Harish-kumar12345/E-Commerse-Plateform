/**
 * Currency utilities for Indian Rupee (INR) calculations.
 * Always handles money in integer minor units (Paise: 1 INR = 100 Paise).
 */

export function formatPaiseToINR(paise: number, options?: { showZeroDecimals?: boolean }): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: options?.showZeroDecimals || paise % 100 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

export function inrToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToInr(paise: number): number {
  return paise / 100;
}

export function calculateDiscountPercent(compareAtInPaise?: number | null, currentPriceInPaise?: number): number {
  if (!compareAtInPaise || !currentPriceInPaise || compareAtInPaise <= currentPriceInPaise) {
    return 0;
  }
  return Math.round(((compareAtInPaise - currentPriceInPaise) / compareAtInPaise) * 100);
}
