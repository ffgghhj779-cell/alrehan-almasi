"use client";

import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966560706018';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Optionally hide on specific pages if needed
  if (pathname === '/checkout') return null;

  const handleClick = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'مرحباً، أود الاستفسار عن خدمات ومنتجات الرهان الماسي.'
      )}`,
      '_blank'
    );
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
      whileTap={{ scale: 0.92 }}
      className={`fixed z-50 flex items-center justify-center p-4 min-w-[56px] min-h-[56px] rounded-full bg-[#25D366] text-white luxury-shadow-lg hover:bg-[#20bd5a] transition-colors group gpu-layer touch-press ${
        isMobile ? 'bottom-[5.5rem] left-4' : 'bottom-8 left-8'
      }`}
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle size={28} fill="currentColor" />
      <span className="absolute right-full mr-4 bg-white text-text-dark text-xs font-bold font-cairo px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none luxury-shadow hidden md:block">
        تحدث معنا الآن
      </span>
    </motion.button>
  );
}
