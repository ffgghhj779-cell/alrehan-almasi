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
  sku: string;
  quantity: number;
  unitPrice: number;
  unitLabel: string;
};

export type AddItemPayload = {
  id: number;
  name: string;
  sku: string;
  unitPrice: number;
  unitLabel: string;
  quantity?: number;
};

type Toast = {
  id: number;
  message: string;
  itemId?: number;
};

type QuoteContextType = {
  items: QuoteItem[];
  addItem: (payload: AddItemPayload) => void;
  addBulkItems: (items: QuoteItem[]) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
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

  const addItem = (payload: AddItemPayload) => {
    const qty = payload.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === payload.id);
      const newQuantity = existing ? existing.quantity + qty : qty;
      const newItems = existing
        ? prev.map((item) =>
            item.id === payload.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  unitPrice: payload.unitPrice,
                  unitLabel: payload.unitLabel,
                }
              : item
          )
        : [
            ...prev,
            {
              id: payload.id,
              name: payload.name,
              sku: payload.sku,
              quantity: qty,
              unitPrice: payload.unitPrice,
              unitLabel: payload.unitLabel,
            },
          ];

      showToast(`تمت إضافة ${payload.name} إلى السلة (${newQuantity})`, payload.id);
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
          existing.unitPrice = newItem.unitPrice;
          existing.unitLabel = newItem.unitLabel;
        } else {
          updatedItems.push({ ...newItem });
        }
      });
      return updatedItems;
    });

    showToast(`تمت إضافة ${incoming.length} منتجات إلى السلة`, BULK_TOAST_KEY);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const incrementItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementItem = (id: number) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target) return prev;
      if (target.quantity <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const clearCart = () => setItems([]);

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        addBulkItems,
        removeItem,
        updateQuantity,
        incrementItem,
        decrementItem,
        clearCart,
        toast,
        removeToast,
      }}
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
