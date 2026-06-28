"use client";

import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload } from 'lucide-react';
import { lookupProductBySku } from '@/lib/products';
import { useQuote, QuoteItem } from './QuoteContext';

type CsvUploaderProps = {
  variant?: 'button' | 'compact';
  className?: string;
  label?: string;
};

type CsvRow = Record<string, string | undefined>;

function pickField(row: CsvRow, keys: string[]): string | undefined {
  for (const key of keys) {
    const match = Object.entries(row).find(
      ([header]) => header.trim().toLowerCase() === key.toLowerCase()
    );
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return undefined;
}

export default function CsvUploader({
  variant = 'button',
  className = '',
  label = 'رفع طلبات عبر CSV',
}: CsvUploaderProps) {
  const { addBulkItems } = useQuote();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedItems: QuoteItem[] = [];

          for (const row of results.data) {
            const sku = pickField(row, ['sku', 'SKU', 'Sku']);
            const quantityRaw = pickField(row, ['quantity', 'Quantity', 'qty', 'Qty']);
            if (!sku || !quantityRaw) continue;

            const quantity = parseInt(quantityRaw, 10);
            if (Number.isNaN(quantity) || quantity <= 0) continue;

            const product = await lookupProductBySku(sku);
            if (!product) continue;

            parsedItems.push({
              id: product.id,
              name: product.name,
              quantity,
            });
          }

          if (parsedItems.length === 0) {
            setParseError('لم يتم العثور على منتجات مطابقة. تأكد من أعمدة SKU و Quantity.');
          } else {
            addBulkItems(parsedItems);
          }
        } catch {
          setParseError('حدث خطأ أثناء معالجة الملف.');
        } finally {
          setIsParsing(false);
        }
      },
      error: () => {
        setParseError('تعذّر قراءة ملف CSV.');
        setIsParsing(false);
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const baseClass =
    variant === 'compact'
      ? 'flex-1 bg-white text-blue-deep border border-blue-primary/20 font-bold py-2 flex items-center justify-center gap-2 hover:bg-secondary transition-colors text-sm disabled:opacity-60'
      : 'bg-white text-blue-deep border border-blue-primary/20 font-bold py-2 px-4 flex items-center justify-center gap-2 hover:bg-secondary transition-colors text-sm rounded-lg disabled:opacity-60';

  return (
    <div className={variant === 'compact' ? 'flex-1' : 'flex flex-col items-center gap-2'}>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isParsing}
        className={`${baseClass} ${className} ${variant === 'compact' ? '' : 'w-full'}`}
        aria-label={label}
      >
        <Upload size={16} aria-hidden="true" />
        {isParsing ? 'جاري المعالجة...' : label}
      </button>
      {parseError && (
        <p className="text-xs text-orange-accent font-tajawal text-center mt-1" role="alert">
          {parseError}
        </p>
      )}
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
        aria-hidden="true"
      />
    </div>
  );
}
