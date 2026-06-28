import { supabase, isSupabaseConfigured } from './supabase';
import { calculateOrderTotals, type PricedLine } from './checkout';
import type { QuoteItem } from '@/components/QuoteContext';

export type CustomerDetails = {
  fullName: string;
  phone: string;
  address: string;
};

export type SaveOrderResult = {
  orderId: string;
  orderNumber: string;
};

function generateOrderNumber(): string {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function saveOrderToDatabase(
  items: QuoteItem[],
  customer: CustomerDetails,
  userId: string | null
): Promise<SaveOrderResult> {
  const pricedLines: PricedLine[] = items.map((item) => ({
    unitPrice: item.unitPrice,
    quantity: item.quantity,
  }));
  const { subtotal, vatAmount, total } = calculateOrderTotals(pricedLines);
  const orderNumber = generateOrderNumber();

  if (!isSupabaseConfigured) {
    return { orderId: crypto.randomUUID(), orderNumber };
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      customer_name: customer.fullName.trim(),
      customer_phone: customer.phone.trim(),
      delivery_address: customer.address.trim(),
      payment_method: 'cod',
      subtotal_ex_vat: subtotal,
      vat_amount: vatAmount,
      total_inc_vat: total,
      status: 'pending',
    })
    .select('id, order_number')
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? 'Failed to create order');
  }

  const lineItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    unit_price_ex_vat: item.unitPrice,
    line_total_ex_vat: Math.round(item.unitPrice * item.quantity * 100) / 100,
    unit_label: item.unitLabel,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(lineItems);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return { orderId: order.id, orderNumber: order.order_number };
}
