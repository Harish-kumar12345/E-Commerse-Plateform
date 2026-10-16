'use client';

import { CartItem } from './cart';
import { formatPaiseToINR } from '@nexus/shared';

export interface OrderItem {
  id: string;
  title: string;
  variant: string;
  priceInPaise: number;
  imageUrl: string;
  quantity: number;
  sellerName: string;
  slug: string;
}

export interface SubOrder {
  id: string;
  sellerName: string;
  trackingNumber: string;
  courier: string;
  status: 'Placed' | 'Packed' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryEstimate: string;
  items: OrderItem[];
  timeline: Array<{
    status: string;
    description: string;
    time: string;
    completed: boolean;
  }>;
}

export interface Order {
  id: string;
  date: string;
  totalAmountInPaise: number;
  status: 'In Transit' | 'Delivered' | 'Cancelled' | 'Processing';
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  subOrders: SubOrder[];
  cancellationReason?: string;
  cancelledAt?: string;
  refundStatus?: string;
}

const ORDERS_STORAGE_KEY = 'nexus_user_orders_v1';

// Initial sample demo order that user can load on-demand
export function createSampleDemoOrder(): Order {
  return {
    id: 'NX-2026-98124',
    date: 'Placed on Oct 11, 2026',
    totalAmountInPaise: 3098800,
    status: 'In Transit',
    shippingAddress: {
      fullName: 'Rahul Sharma',
      phone: '+91 9892019283',
      line1: 'B-402, Lodha Bellissimo, NM Joshi Marg, Mahalaxmi West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400011',
    },
    paymentMethod: 'UPI (Google Pay)',
    subOrders: [
      {
        id: 'NX-2026-98124-S1',
        sellerName: 'Apex Electronics India',
        trackingNumber: 'SR982104928IN',
        courier: 'Shiprocket Express',
        status: 'In Transit',
        deliveryEstimate: 'Arriving Thursday, Oct 15',
        items: [
          {
            id: 'item-1',
            title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
            variant: 'Midnight Black',
            priceInPaise: 2799000,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            quantity: 1,
            sellerName: 'Apex Electronics India',
            slug: 'sony-wh-1000xm5-wireless-anc-headphones',
          },
        ],
        timeline: [
          {
            status: 'In Transit (Regional Sorting Hub)',
            description: 'Package arrived at Thane distribution hub and processed for outbound dispatch.',
            time: 'Today, 2:45 PM',
            completed: true,
          },
          {
            status: 'Picked Up by Shiprocket Logistics',
            description: 'Picked up from Apex Electronics facility (MIDC Industrial Area, Andheri East, Mumbai).',
            time: 'Yesterday, 6:15 PM',
            completed: true,
          },
          {
            status: 'Order Placed & Confirmed',
            description: 'Order confirmed and inventory allocated in warehouse.',
            time: 'Oct 11, 11:30 AM',
            completed: true,
          },
        ],
      },
      {
        id: 'NX-2026-98124-S2',
        sellerName: 'Urban Stitch Apparels',
        trackingNumber: 'DL98129031IN',
        courier: 'Delhivery Surface',
        status: 'Packed',
        deliveryEstimate: 'Arriving Friday, Oct 16',
        items: [
          {
            id: 'item-2',
            title: 'Heavyweight Supima Oversized Cotton Tee (280 GSM)',
            variant: 'Washed Charcoal / Medium',
            priceInPaise: 299800,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
            quantity: 2,
            sellerName: 'Urban Stitch Apparels',
            slug: 'heavyweight-supima-oversized-cotton-tee',
          },
        ],
        timeline: [
          {
            status: 'Packed & Ready for Dispatch',
            description: 'Seller has packaged the item and generated shipment airway bill (AWB).',
            time: 'Yesterday, 4:20 PM',
            completed: true,
          },
          {
            status: 'Order Placed & Confirmed',
            description: 'Order received by Urban Stitch Apparels.',
            time: 'Oct 11, 11:30 AM',
            completed: true,
          },
        ],
      },
    ],
  };
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('nexus-orders-updated'));
  } catch (err) {}
}

export function getOrderById(orderId: string): Order | null {
  const orders = getStoredOrders();
  const match = orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
  if (match) return match;

  // Fallback demo order lookup
  const sample = createSampleDemoOrder();
  if (sample.id.toLowerCase() === orderId.toLowerCase()) {
    return sample;
  }
  return null;
}

export function createOrderFromCart(
  cartItems: CartItem[],
  address: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  },
  paymentMethod: string = 'RAZORPAY_UPI'
): Order {
  const orderNumber = `NX-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateStr = `Placed on ${new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  // Group items by seller
  const sellerMap = new Map<string, CartItem[]>();
  for (const item of cartItems) {
    const sName = item.sellerName || 'Apex Electronics India';
    const existing = sellerMap.get(sName) || [];
    existing.push(item);
    sellerMap.set(sName, existing);
  }

  const subOrders: SubOrder[] = [];
  let subIndex = 1;

  sellerMap.forEach((items, sellerName) => {
    const subOrderId = `${orderNumber}-S${subIndex++}`;
    const awb = `SR${Math.floor(100000000 + Math.random() * 900000000)}IN`;

    const subOrderItems: OrderItem[] = items.map((c) => ({
      id: c.id,
      title: c.title,
      variant: c.variantTitle || 'Standard',
      priceInPaise: c.priceInPaise,
      imageUrl: c.imageUrl,
      quantity: c.quantity,
      sellerName: c.sellerName,
      slug: c.slug,
    }));

    subOrders.push({
      id: subOrderId,
      sellerName,
      trackingNumber: awb,
      courier: 'Shiprocket Express',
      status: 'Placed',
      deliveryEstimate: 'Arriving in 2-3 business days',
      items: subOrderItems,
      timeline: [
        {
          status: 'Order Placed & Verified',
          description: 'Payment authorized and sent to vendor fulfillment center.',
          time: 'Just now',
          completed: true,
        },
        {
          status: 'Warehouse Processing',
          description: 'Vendor is preparing item for security packaging and AWB generation.',
          time: 'Estimated within 4 hours',
          completed: false,
        },
      ],
    });
  });

  const totalAmountInPaise = cartItems.reduce(
    (acc, item) => acc + item.priceInPaise * item.quantity,
    0
  );

  const newOrder: Order = {
    id: orderNumber,
    date: dateStr,
    totalAmountInPaise,
    status: 'In Transit',
    shippingAddress: address,
    paymentMethod,
    subOrders,
  };

  const current = getStoredOrders();
  saveOrders([newOrder, ...current]);
  return newOrder;
}

export function cancelOrder(orderId: string, reason: string): boolean {
  const orders = getStoredOrders();
  const orderIdx = orders.findIndex((o) => o.id.toLowerCase() === orderId.toLowerCase());

  let targetOrder: Order;
  if (orderIdx > -1) {
    targetOrder = orders[orderIdx];
  } else {
    // If cancelling the demo order
    const sample = createSampleDemoOrder();
    if (sample.id.toLowerCase() === orderId.toLowerCase()) {
      targetOrder = sample;
      orders.push(targetOrder);
    } else {
      return false;
    }
  }

  const cancelledTimestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  targetOrder.status = 'Cancelled';
  targetOrder.cancellationReason = reason;
  targetOrder.cancelledAt = `Cancelled on ${new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} at ${cancelledTimestamp}`;
  targetOrder.refundStatus = `100% Refund of ${formatPaiseToINR(
    targetOrder.totalAmountInPaise
  )} initiated to source payment mode (ARN: RF-${Math.floor(
    10000000 + Math.random() * 90000000
  )})`;

  // Update all sub-orders
  targetOrder.subOrders = targetOrder.subOrders.map((sub) => ({
    ...sub,
    status: 'Cancelled',
    timeline: [
      {
        status: 'Order Cancelled by Customer',
        description: `Cancellation requested: "${reason}". Dispatch halted and full refund ledger generated.`,
        time: 'Just now',
        completed: true,
      },
      ...sub.timeline,
    ],
  }));

  saveOrders(orders);
  return true;
}

export function loadSampleOrder(): Order {
  const sample = createSampleDemoOrder();
  const current = getStoredOrders();
  const exists = current.some((o) => o.id === sample.id);
  if (!exists) {
    saveOrders([sample, ...current]);
  }
  return sample;
}

export function clearAllOrders(): void {
  saveOrders([]);
}
