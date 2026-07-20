"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Menu, X, ShoppingBag, Phone } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { useQuote } from './QuoteContext';

const navItems = ['الرئيسية', 'الأقسام', 'من نحن', 'المميزات', 'منتجاتنا', 'المعرض'];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useQuote();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 px-4 md:px-12 py-2.5 md:py-4 pt-safe gpu-layer bg-blue-deep transition-shadow duration-300 ${
          isScrolled
            ? 'luxury-shadow border-b border-orange-accent'
            : 'border-b border-white/10'
        }`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="container mx-auto flex justify-between items-center gap-3 min-h-[48px]">
          <Link
            href="/"
            className="flex items-center gap-3 min-w-0 flex-1 md:flex-none group touch-press active:scale-[0.98] transition-transform"
          >
            <div className="relative h-10 w-10 md:h-14 md:w-14 shrink-0 group-hover:scale-[1.05] transition-transform duration-300 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="شعار الرهان الماسي"
                fill
                quality={100}
                className="object-contain drop-shadow-sm"
                priority
                sizes="(max-width: 768px) 40px, 60px"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-tajawal font-extrabold text-xl md:text-2xl tracking-tight text-white drop-shadow-sm leading-none mt-1">
                الرهان الماسي
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-white">
            {navItems.map((item) => (
              <a
                key={item}
                href={`/#${item}`}
                className="hover:text-orange-accent transition-colors touch-target touch-press whitespace-nowrap"
              >
                {item}
              </a>
            ))}
            <Link
              href="/products"
              className="hover:text-orange-accent transition-colors touch-target touch-press whitespace-nowrap"
            >
              جميع المنتجات
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+966560706018" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors whitespace-nowrap" dir="ltr">
              <Phone size={18} className="text-orange-accent shrink-0" />
              <span className="font-tajawal font-bold text-sm tracking-wider">+966 56 070 6018</span>
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-cart'))}
              className="relative p-2.5 text-white hover:text-orange-accent transition-colors touch-target touch-press active:scale-95"
              aria-label={itemCount > 0 ? `عرض السلة (${itemCount} منتج)` : 'عرض السلة'}
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1 bg-orange-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full luxury-shadow border border-blue-deep">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              href="/#منتجاتنا"
              className="px-5 py-2.5 bg-white text-blue-deep text-sm font-bold hover:bg-orange-accent hover:text-white transition-all luxury-shadow touch-press active:scale-95 rounded-lg"
            >
              طلب عرض سعر
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-cart'))}
              className="relative text-white touch-target touch-press active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-xl border border-white/20 bg-white/10"
              aria-label={itemCount > 0 ? `عرض السلة (${itemCount} منتج)` : 'عرض السلة'}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-accent text-white text-[10px] font-bold min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full luxury-shadow">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="text-white touch-target touch-press active:scale-95 transition-transform flex items-center justify-center w-10 h-10 rounded-xl border border-white/20 bg-white/10"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <BottomSheet
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        ariaLabelledBy="mobile-nav-title"
        maxHeightClass="h-[90vh] max-h-[90vh]"
      >
        <div className="px-4 pb-4 overflow-y-auto">
          <h2 id="mobile-nav-title" className="sr-only">
            قائمة التنقل
          </h2>
          <nav className="flex flex-col gap-1">
            {[...navItems, 'جميع المنتجات'].map((item) => (
              <a
                key={item}
                href={item === 'جميع المنتجات' ? '/products' : `/#${item}`}
                className="font-semibold text-text-dark w-full text-center py-3.5 touch-target touch-press active:scale-[0.98] transition-transform border-b border-gray-100 last:border-b-0"
                onClick={closeMobileMenu}
              >
                {item}
              </a>
            ))}
          </nav>
          <Link
            href="/#منتجاتنا"
            onClick={closeMobileMenu}
            className="mt-4 block w-full text-center px-6 py-3.5 border border-orange-accent text-orange-accent text-sm font-bold touch-press active:scale-95 transition-transform rounded-xl"
          >
            طلب عرض سعر
          </Link>
        </div>
      </BottomSheet>
    </>
  );
}
