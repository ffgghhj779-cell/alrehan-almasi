"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';

export type QuoteItem = {
  id: number;
  name: string;
  quantity: number;
};

type Toast = {
  id: number;
  message: string;
  itemId?: number;
};

type QuoteContextType = {
  items: QuoteItem[];
  addItem: (id: number, name: string) => void;
  addBulkItems: (items: QuoteItem[]) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  toast: Toast | null;
  removeToast: () => void;
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const TOAST_DURATION_MS = 3000;
const BULK_TOAST_KEY = -1;

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<number>(0);

  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (message: string, itemId?: number) => {
      clearToastTimer();

      setToast((prev) => {
        const isSameItem =
          itemId !== undefined && prev?.itemId === itemId;
        const isSameBulk =
          itemId === BULK_TOAST_KEY && prev?.itemId === BULK_TOAST_KEY;

        if (isSameItem || isSameBulk) {
          return { ...prev!, message };
        }

        toastIdRef.current += 1;
        return { id: toastIdRef.current, message, itemId };
      });

      toastTimerRef.current = setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, TOAST_DURATION_MS);
    },
    [clearToastTimer]
  );

  const removeToast = useCallback(() => {
    clearToastTimer();
    setToast(null);
  }, [clearToastTimer]);

  const addItem = (id: number, name: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      const newQuantity = existing ? existing.quantity + 1 : 1;
      const newItems = existing
        ? prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
        : [...prev, { id, name, quantity: 1 }];

      showToast(
        `تمت إضافة ${name} إلى قائمة طلب التسعير (الكمية: ${newQuantity})`,
        id
      );
      return newItems;
    });
  };

  const addBulkItems = (incoming: QuoteItem[]) => {
    if (incoming.length === 0) return;

    setItems((prev) => {
      const updatedItems = [...prev];
      incoming.forEach((newItem) => {
        const existing = updatedItems.find((i) => i.id === newItem.id);
        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          updatedItems.push({ ...newItem });
        }
      });
      return updatedItems;
    });

    showToast(`تمت إضافة ${incoming.length} منتجات عبر ملف CSV`, BULK_TOAST_KEY);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <QuoteContext.Provider
      value={{ items, addItem, addBulkItems, removeItem, clearCart, toast, removeToast }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
