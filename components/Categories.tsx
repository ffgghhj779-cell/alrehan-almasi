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
}: {
  cat: (typeof STORE_CATEGORIES)[number];
  index: number;
  className?: string;
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
        className="group block relative h-[220px] md:h-[260px] rounded-2xl overflow-hidden luxury-shadow-lg border border-white/60 touch-press active:scale-[0.98] transition-transform gpu-accelerated"
      >
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          quality={90}
          sizes="(max-width: 768px) 180px, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/95 via-blue-deep/45 to-blue-deep/10" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />

        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 text-[10px] font-bold font-cairo text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full">
            فئة مميزة
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
          <h3 className="font-cairo font-bold text-white text-base md:text-lg leading-snug mb-1">
            {cat.name}
          </h3>
          <p className="text-white/75 text-xs font-tajawal mb-3">{cat.subtitle}</p>
          <span className="inline-flex items-center gap-1.5 text-orange-accent text-xs font-bold font-cairo group-hover:gap-2.5 transition-all">
            تصفح المنتجات
            <ArrowLeft size={14} aria-hidden="true" />
          </span>
        </div>

        <div className="category-accent-bar absolute bottom-0 inset-x-0 h-1 bg-orange-accent z-10" />
      </Link>
    </motion.div>
  );
}

export default function Categories() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-secondary/40 flex-1" id="الأقسام">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold font-cairo text-blue-deep mb-2">
              تصفح الفئات الرئيسية
            </h3>
            <p className="text-sm text-gray-500 font-tajawal">
              منتجات طازجة ومجمدة بمعايير توريد احترافية
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-orange-accent font-bold touch-target touch-press shrink-0"
          >
            عرض الكل &larr;
          </Link>
        </div>

        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-3">
            {STORE_CATEGORIES.map((cat, index) => (
              <CategoryCard
                key={cat.name}
                cat={cat}
                index={index}
                className="shrink-0 w-[180px] snap-start"
              />
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STORE_CATEGORIES.map((cat, index) => (
            <CategoryCard key={cat.name} cat={cat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
