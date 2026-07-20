"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import BottomSheet from './BottomSheet';

const navItems = ['الرئيسية', 'الأقسام', 'من نحن', 'المميزات', 'منتجاتنا', 'المعرض'];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 px-4 md:px-12 py-2.5 md:py-4 pt-safe gpu-layer ${
          isScrolled
            ? 'glass-panel luxury-shadow border-b border-orange-accent/20'
            : 'glass-panel border-b border-blue-primary/10'
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
            <div className="relative h-10 w-10 md:h-24 md:w-24 shrink-0 rounded-xl md:rounded-2xl overflow-hidden luxury-shadow ring-2 ring-blue-primary/10 group-hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="شعار الرهان الماسي"
                fill
                quality={100}
                className="object-cover"
                priority
                sizes="(max-width: 768px) 40px, 96px"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 md:gap-1.5">
              <span className="font-cairo font-black tracking-tight text-base md:text-3xl text-blue-deep leading-tight truncate">
                الرهان الماسي
              </span>
              <span className="hidden md:block text-xs font-bold text-orange-accent tracking-wider">
                شريكك الموثوق للتوريد
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-text-dark/80">
            {navItems.map((item) => (
              <a
                key={item}
                href={`/#${item}`}
                className="hover:text-orange-accent transition-colors touch-target touch-press"
              >
                {item}
              </a>
            ))}
            <Link
              href="/products"
              className="hover:text-orange-accent transition-colors touch-target touch-press"
            >
              جميع المنتجات
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/#منتجاتنا"
              className="px-6 py-2.5 border border-orange-accent text-orange-accent text-sm font-bold hover:bg-orange-accent hover:text-white transition-all luxury-shadow touch-press active:scale-95"
            >
              طلب عرض سعر
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden shrink-0 text-blue-primary touch-target touch-press active:scale-95 transition-transform flex items-center justify-center w-11 h-11 rounded-xl border border-blue-primary/10 bg-white/50"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
