"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const categories = [
  { name: 'الفواكه الطازجة', icon: '🍎', image: 'https://picsum.photos/seed/fruits/400/300' },
  { name: 'الخضروات الطازجة', icon: '🥬', image: 'https://picsum.photos/seed/veggies/400/300' },
  { name: 'الأسماك الطازجة', icon: '🐟', image: 'https://picsum.photos/seed/fish/400/300' },
  { name: 'الدواجن الطازجة', icon: '🐔', image: 'https://picsum.photos/seed/poultry/400/300' },
  { name: 'المنتجات المجمدة', icon: '🧊', image: 'https://picsum.photos/seed/frozen/400/300' },
  { name: 'الأرز', icon: '🌾', image: 'https://picsum.photos/seed/rice/400/300' },
  { name: 'الزيوت الغذائية', icon: '🫒', image: 'https://picsum.photos/seed/oil/400/300' },
  { name: 'المواد الغذائية', icon: '🥫', image: 'https://picsum.photos/seed/grocery/400/300' },
];

function CategoryCard({ cat, index }: { cat: (typeof categories)[number]; index: number }) {
  return (
    <motion.div
      className="group relative overflow-hidden bg-secondary border border-gray-100 flex flex-col justify-end p-4 hover:border-orange-accent transition-colors cursor-pointer h-[200px] touch-press active:scale-[0.98] gpu-accelerated shrink-0 w-[160px] md:w-auto snap-start"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08 }}
      whileTap={{ scale: 0.97 }}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          quality={90}
          sizes="(max-width: 768px) 160px, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="text-3xl">{cat.icon}</div>
        <div>
          <h3 className="font-bold text-blue-primary font-cairo text-sm">{cat.name}</h3>
          <div className="text-xs opacity-60 font-tajawal">أجود الأنواع اليومية</div>
        </div>
      </div>
      <div className="category-accent-bar h-1 w-full bg-green-accent absolute bottom-0 right-0 z-20" />
    </motion.div>
  );
}

export default function Categories() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-white flex-1" id="الأقسام">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold border-r-4 border-orange-accent pr-4 font-cairo">
            تصفح الفئات الرئيسية
          </h3>
          <Link href="/products" className="text-sm text-orange-accent font-bold">
            عرض الكل &larr;
          </Link>
        </div>

        <div className="md:hidden -mx-4 px-4 mb-2">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-secondary border border-gray-100 h-[200px] w-[160px] shrink-0 skeleton-shimmer snap-start"
                    />
                  ))
              : categories.map((cat, index) => (
                  <CategoryCard key={cat.name} cat={cat} index={index} />
                ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-4 gap-4 auto-rows-[200px]">
          {isLoading
            ? Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-secondary border border-gray-100 h-[200px] skeleton-shimmer"
                  />
                ))
            : categories.map((cat, index) => (
                <CategoryCard key={cat.name} cat={cat} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
