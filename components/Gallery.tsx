"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { GALLERY_IMAGES } from '@/lib/product-images';

const layoutClasses = [
  'col-span-2 row-span-1 min-h-[180px] md:min-h-[250px]',
  'col-span-1 row-span-2 min-h-[280px] md:min-h-[520px]',
  'col-span-1 row-span-2 min-h-[280px] md:min-h-[520px]',
  'col-span-2 row-span-1 min-h-[180px] md:min-h-[250px]',
  'col-span-2 md:col-span-4 row-span-1 min-h-[160px] md:min-h-[220px]',
];

export default function Gallery() {
  return (
    <section className="py-12 md:py-24 bg-primary overflow-x-hidden" id="المعرض">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-[#E67E22] text-xs font-bold tracking-[0.25em] uppercase mb-3 font-cairo">
            Our Gallery
          </p>
          <h2 className="font-cairo text-2xl md:text-5xl font-bold text-blue-deep mb-3 md:mb-4">
            معرض منتجاتنا
          </h2>
          <div className="w-20 md:w-24 h-1 bg-orange-accent mx-auto rounded-full mb-4 md:mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg font-tajawal px-2">
            من المزرعة إلى مائدتكم — جودة الدواجن والبيض واللحوم في كل صورة
          </p>
        </motion.div>

        {/* Mobile: horizontal swipe */}
        <div className="md:hidden -mx-4 mb-2">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-2">
            {GALLERY_IMAGES.map((item, i) => (
              <motion.div
                key={item.label}
                className="relative shrink-0 w-[260px] h-[200px] snap-start rounded-2xl overflow-hidden luxury-shadow-lg group touch-press active:scale-[0.98] transition-transform gpu-accelerated block"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={item.href} className="absolute inset-0 z-10">
                  <span className="sr-only">تصفح {item.label}</span>
                </Link>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  quality={100}
                  sizes="260px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2B5E]/85 via-[#1B2B5E]/20 to-transparent pointer-events-none" />
                <p className="absolute bottom-3 right-3 left-3 font-cairo font-bold text-white text-sm pointer-events-none flex items-center justify-between">
                  {item.label}
                  <span className="text-orange-accent text-xs">تصفح &larr;</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: masonry grid */}
        <div className="hidden md:grid grid-cols-4 gap-4 md:gap-6">
          {GALLERY_IMAGES.map((item, i) => (
            <motion.div
              key={item.label}
              className={`relative rounded-2xl overflow-hidden group luxury-shadow-lg hover:luxury-shadow-lg touch-press active:scale-[0.98] transition-all duration-300 gpu-accelerated block ${layoutClasses[i] ?? ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={item.href} className="absolute inset-0 z-10">
                <span className="sr-only">تصفح {item.label}</span>
              </Link>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={100}
                sizes="(max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2B5E]/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 font-cairo font-bold text-white text-lg pointer-events-none flex items-end justify-between">
                <span>{item.label}</span>
                <span className="text-orange-accent text-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  تصفح &larr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
