"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navItems = ['الرئيسية', 'الأقسام', 'من نحن', 'المميزات', 'منتجاتنا', 'المعرض'];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 md:py-4 ${
        isScrolled
          ? 'glass-panel luxury-shadow border-b border-orange-accent/20'
          : 'glass-panel border-b border-blue-primary/10'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4 md:gap-5 group">
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden luxury-shadow group-hover:scale-[1.02] transition-transform duration-300 ring-2 ring-blue-primary/10">
            <Image
              src="/logo.png"
              alt="شعار الرهان الماسي"
              fill
              quality={90}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-center gap-1 md:gap-1.5">
            <span className="font-cairo font-black tracking-tight text-xl md:text-3xl text-blue-deep leading-none">
              الرهان الماسي
            </span>
            <span className="text-[10px] md:text-xs font-bold text-orange-accent tracking-wider">
              شريكك الموثوق للتوريد
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-text-dark/80">
          {navItems.map((item) => (
            <a
              key={item}
              href={`/#${item}`}
              className="hover:text-orange-accent transition-colors"
            >
              {item}
            </a>
          ))}
          <Link href="/products" className="hover:text-orange-accent transition-colors">
            جميع المنتجات
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/#منتجاتنا"
            className="px-6 py-2.5 border border-orange-accent text-orange-accent text-sm font-bold hover:bg-orange-accent hover:text-white transition-all luxury-shadow"
          >
            طلب عرض سعر
          </Link>
        </div>

        <button
          className="md:hidden text-blue-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="القائمة"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 w-full glass-panel luxury-shadow py-4 flex flex-col items-center gap-4 border-t border-blue-primary/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {[...navItems, 'جميع المنتجات'].map((item) => (
              <a
                key={item}
                href={item === 'جميع المنتجات' ? '/products' : `/#${item}`}
                className="font-semibold text-text-dark w-full text-center py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
