export interface CartItemInput {
  variantId: string;
  sellerId: string;
  unitPriceInPaise: number;
  quantity: number;
  taxRatePercent: number;
  commissionRate: number; // e.g. 0.08 for 8%
}

export interface SellerSubOrderSplit {
  sellerId: string;
  itemCount: number;
  subtotalInPaise: number;
  taxInPaise: number;
  commissionInPaise: number;
  netPayoutInPaise: number;
  items: CartItemInput[];
}

export interface OrderSplitResult {
  totalGrossInPaise: number;
  totalTaxInPaise: number;
  totalPlatformCommissionInPaise: number;
  subOrders: SellerSubOrderSplit[];
}

export function splitCartIntoSellerSubOrders(items: CartItemInput[]): OrderSplitResult {
  const sellerGroups = new Map<string, CartItemInput[]>();

  for (const item of items) {
    const list = sellerGroups.get(item.sellerId) || [];
    list.push(item);
    sellerGroups.set(item.sellerId, list);
  }

  const subOrders: SellerSubOrderSplit[] = [];
  let totalGrossInPaise = 0;
  let totalTaxInPaise = 0;
  let totalPlatformCommissionInPaise = 0;

  for (const [sellerId, sellerItems] of sellerGroups.entries()) {
    let subtotal = 0;
    let tax = 0;
    let commission = 0;
    let itemCount = 0;

    for (const item of sellerItems) {
      const lineTotal = item.unitPriceInPaise * item.quantity;
      subtotal += lineTotal;
      itemCount += item.quantity;

      // Tax inclusive calculation: Tax = Gross - (Gross / (1 + rate / 100))
      const taxable = Math.round(lineTotal / (1 + item.taxRatePercent / 100));
      const lineTax = lineTotal - taxable;
      tax += lineTax;

      // Commission on taxable portion (or gross)
      const lineCommission = Math.round(taxable * item.commissionRate);
      commission += lineCommission;
    }

    const netPayout = subtotal - commission;

    totalGrossInPaise += subtotal;
    totalTaxInPaise += tax;
    totalPlatformCommissionInPaise += commission;

    subOrders.push({
      sellerId,
      itemCount,
      subtotalInPaise: subtotal,
      taxInPaise: tax,
      commissionInPaise: commission,
      netPayoutInPaise: netPayout,
      items: sellerItems,
    });
  }

  return {
    totalGrossInPaise,
    totalTaxInPaise,
    totalPlatformCommissionInPaise,
    subOrders,
  };
}
