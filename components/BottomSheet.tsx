"use client";

import { useRef, type ReactNode } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabelledBy?: string;
  maxHeightClass?: string;
  sheetClassName?: string;
};

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
  maxHeightClass = 'h-[90vh] max-h-[90vh]',
  sheetClassName = 'rounded-t-3xl',
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEscapeKey(onClose, isOpen);
  useFocusTrap(panelRef, isOpen);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 450) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-blue-deep/30 z-40 gpu-layer md:backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className={`fixed inset-x-0 bottom-0 z-50 flex flex-col bottom-sheet-panel glass-panel luxury-shadow-lg border-t border-blue-primary/10 gpu-layer pb-safe overflow-hidden ${maxHeightClass} ${sheetClassName}`}
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="sheet-drag-handle shrink-0" aria-hidden="true" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
