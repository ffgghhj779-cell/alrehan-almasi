"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { STORE_CATEGORIES } from '@/lib/product-images';

function CategoryCard({
  cat,
  index,
  className = '',
  compact = false,
}: {
  cat: (typeof STORE_CATEGORIES)[number];
  index: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.07, 0.35), duration: 0.45 }}
      className={className}
    >
      <Link
        href={`/products?category=${encodeURIComponent(cat.name)}`}
        className={`group block relative overflow-hidden luxury-shadow-lg border border-white/80 touch-press active:scale-[0.98] transition-transform gpu-accelerated glass-panel ${
          compact
            ? 'h-[190px] w-[220px] rounded-2xl snap-start shrink-0'
            : 'h-[220px] md:h-[260px] rounded-2xl'
        }`}
      >
        <div className="absolute inset-0 bg-white" />
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          quality={100}
          sizes={compact ? '220px' : '(max-width: 768px) 50vw, 25vw'}
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.1] saturate-[1.1] brightness-[1.05] p-2"
          referrerPolicy="no-referrer"
        />
        
        {/* Watermark Logo Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <span className="font-tajawal font-black text-2xl md:text-3xl tracking-widest text-blue-deep/30 transform -rotate-12 select-none px-4 py-1">
            الرهان الماسي
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/95 via-blue-deep/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-2xl pointer-events-none" />

        <div className="absolute top-2.5 left-2.5">
          <span className="inline-block px-2 py-0.5 text-[9px] font-bold font-cairo text-white/95 bg-white/20 backdrop-blur-sm border border-white/25 rounded-full">
            فئة مميزة
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-3.5 md:p-5">
          <h3 className="font-cairo font-bold text-white text-sm md:text-lg leading-snug mb-0.5 line-clamp-2">
            {cat.name}
          </h3>
          <p className="text-white/75 text-[11px] md:text-xs font-tajawal mb-2 line-clamp-1">
            {cat.subtitle}
          </p>
          <span className="inline-flex items-center gap-1 text-orange-accent text-[11px] font-bold font-cairo">
            تصفح
            <ArrowLeft size={12} aria-hidden="true" />
          </span>
        </div>

        <div className="category-accent-bar absolute bottom-0 inset-x-0 h-0.5 bg-orange-accent z-10" />
      </Link>
    </motion.div>
  );
}

export default function Categories() {
  return (
    <section
      className="relative z-10 -mt-10 md:-mt-14 pt-6 pb-8 md:py-16 bg-primary rounded-t-3xl md:rounded-none luxury-shadow-lg md:shadow-none border-t border-white/80 md:border-t-0"
      id="الأقسام"
    >
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex justify-between items-end mb-5 md:mb-8 gap-3">
          <div className="min-w-0">
            <h3 className="text-xl md:text-3xl font-bold font-cairo text-blue-deep mb-1 md:mb-2">
              تصفح الفئات الرئيسية
            </h3>
            <p className="text-xs md:text-sm text-gray-500 font-tajawal">
              منتجات طازجة ومجمدة بمعايير توريد احترافية
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs md:text-sm text-orange-accent font-bold touch-target touch-press shrink-0 whitespace-nowrap"
          >
            عرض الكل &larr;
          </Link>
        </div>

        {/* Mobile: premium horizontal carousel */}
        <div className="md:hidden -mx-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-2 overscroll-x-contain">
            {STORE_CATEGORIES.map((cat, index) => (
              <CategoryCard key={cat.name} cat={cat} index={index} compact />
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STORE_CATEGORIES.map((cat, index) => (
            <CategoryCard key={cat.name} cat={cat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
