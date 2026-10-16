import { describe, it, expect } from 'vitest';
import { splitCartIntoSellerSubOrders } from './cart-split.js';

describe('Multi-Vendor Cart Split & Commission Logic', () => {
  it('correctly partitions items from 2 different sellers into isolated sub-orders', () => {
    const items = [
      {
        variantId: 'v1',
        sellerId: 'seller-apex',
        unitPriceInPaise: 2799000, // ₹27,990
        quantity: 1,
        taxRatePercent: 18.0,
        commissionRate: 0.08, // 8% commission
      },
      {
        variantId: 'v2',
        sellerId: 'seller-urban',
        unitPriceInPaise: 149900, // ₹1,499
        quantity: 2,
        taxRatePercent: 12.0,
        commissionRate: 0.12, // 12% commission
      },
    ];

    const result = splitCartIntoSellerSubOrders(items);

    expect(result.subOrders).toHaveLength(2);

    // Total gross: 2799000 + (149900 * 2) = 2799000 + 299800 = 3098800 paise (₹30,988)
    expect(result.totalGrossInPaise).toBe(3098800);

    // Apex suborder
    const apexSubOrder = result.subOrders.find((s) => s.sellerId === 'seller-apex');
    expect(apexSubOrder).toBeDefined();
    expect(apexSubOrder?.subtotalInPaise).toBe(2799000);
    expect(apexSubOrder?.itemCount).toBe(1);
    expect(apexSubOrder?.commissionInPaise).toBeGreaterThan(0);
    expect(apexSubOrder?.netPayoutInPaise).toBe(apexSubOrder!.subtotalInPaise - apexSubOrder!.commissionInPaise);

    // Urban suborder
    const urbanSubOrder = result.subOrders.find((s) => s.sellerId === 'seller-urban');
    expect(urbanSubOrder).toBeDefined();
    expect(urbanSubOrder?.subtotalInPaise).toBe(299800);
    expect(urbanSubOrder?.itemCount).toBe(2);
  });

  it('aggregates multiple variants for the same seller into a single sub-order', () => {
    const items = [
      {
        variantId: 'v1',
        sellerId: 'seller-apex',
        unitPriceInPaise: 500000,
        quantity: 1,
        taxRatePercent: 18.0,
        commissionRate: 0.10,
      },
      {
        variantId: 'v2',
        sellerId: 'seller-apex',
        unitPriceInPaise: 300000,
        quantity: 3,
        taxRatePercent: 18.0,
        commissionRate: 0.10,
      },
    ];

    const result = splitCartIntoSellerSubOrders(items);

    expect(result.subOrders).toHaveLength(1);
    expect(result.subOrders[0].itemCount).toBe(4);
    expect(result.subOrders[0].subtotalInPaise).toBe(1400000);
  });
});
