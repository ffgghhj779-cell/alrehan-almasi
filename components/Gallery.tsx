"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
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
          <h2 className="font-cairo text-2xl md:text-5xl font-bold text-blue-deep mb-3 md:mb-4">
            معرض الصور
          </h2>
          <div className="w-20 md:w-24 h-1 bg-orange-accent mx-auto rounded-full mb-4 md:mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg font-tajawal px-2">
            من البحر إلى مائدتكم — جودة التوريد والتخزين المبرد في الرهان الماسي
          </p>
        </motion.div>

        {/* Mobile: horizontal swipe */}
        <div className="md:hidden -mx-4 mb-2">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-2">
            {GALLERY_IMAGES.map((item, i) => (
              <motion.div
                key={item.label}
                className="relative shrink-0 w-[260px] h-[200px] snap-start rounded-2xl overflow-hidden luxury-shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  quality={90}
                  sizes="260px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/85 via-blue-deep/20 to-transparent" />
                <p className="absolute bottom-3 right-3 left-3 font-cairo font-bold text-white text-sm">
                  {item.label}
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
              className={`relative rounded-2xl overflow-hidden group luxury-shadow-lg hover:luxury-shadow-lg transition-shadow duration-300 ${layoutClasses[i] ?? ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={90}
                sizes="(max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <p className="absolute bottom-4 right-4 left-4 font-cairo font-bold text-white text-lg">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
