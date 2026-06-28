"use client";

import { useQuote } from './QuoteContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export default function ToastContainer() {
  const { toast } = useQuote();

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none flex justify-center w-full px-4 max-w-sm"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.itemId ?? toast.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="bg-white border-r-4 border-orange-accent luxury-shadow px-4 py-3 flex items-center gap-3 w-full pointer-events-auto gpu-accelerated"
            role="status"
          >
            <CheckCircle className="text-green-accent shrink-0" size={20} aria-hidden="true" />
            <p className="text-text-dark font-bold font-cairo text-sm">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
