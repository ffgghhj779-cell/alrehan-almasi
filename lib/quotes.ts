import { supabase, isSupabaseConfigured } from './supabase';
import type { QuoteItem } from '@/components/QuoteContext';

type SaveQuoteResult = {
  referenceCode: string;
  quoteId: string;
} | null;

export async function saveQuoteToDatabase(
  items: QuoteItem[],
  userId: string | null
): Promise<SaveQuoteResult> {
  if (!isSupabaseConfigured || items.length === 0) return null;

  const referenceCode = `AR-${Math.floor(1000 + Math.random() * 9000)}`;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert({
      user_id: userId,
      reference_code: referenceCode,
      status: 'sent',
      total_items: totalItems,
    })
    .select('id, reference_code')
    .single();

  if (quoteError || !quote) {
    throw new Error(quoteError?.message ?? 'Failed to create quote');
  }

  const lineItems = await Promise.all(
    items.map(async (item) => {
      const { data: product } = await supabase
        .from('products')
        .select('id, sku, base_price')
        .eq('id', item.id)
        .maybeSingle();

      return {
        quote_id: quote.id,
        product_id: product?.id ?? item.id,
        product_name: item.name,
        sku: product?.sku ?? null,
        quantity: item.quantity,
        unit_price: product?.base_price ?? null,
      };
    })
  );

  const { error: itemsError } = await supabase.from('quote_items').insert(lineItems);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return { referenceCode: quote.reference_code, quoteId: quote.id };
}
