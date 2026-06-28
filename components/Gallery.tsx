"use client";

import { motion } from 'motion/react';
import Image from 'next/image';

const images = [
  'https://picsum.photos/seed/freshfishmarket/800/600',
  'https://picsum.photos/seed/coldstoragewarehouse/400/600',
  'https://picsum.photos/seed/vegetablesfarmfresh/600/600',
  'https://picsum.photos/seed/logistictrucks/800/400',
  'https://picsum.photos/seed/poultryfarmhouse/400/400',
];

export default function Gallery() {
  return (
    <section className="py-12 md:py-24 bg-primary" id="المعرض">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="font-cairo text-3xl md:text-5xl font-bold text-blue-deep mb-4">
            معرض الصور
          </h2>
          <div className="w-24 h-1 bg-orange-accent mx-auto rounded-full mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-tajawal">
            نظرة على عملياتنا وإمكانياتنا في التوريد والتخزين المبرد.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={`relative rounded-3xl overflow-hidden group luxury-shadow hover:luxury-shadow-lg transition-shadow duration-300 ${
                i === 0
                  ? 'col-span-2 row-span-1'
                  : i === 1
                    ? 'col-span-1 row-span-2'
                    : i === 2
                      ? 'col-span-1 row-span-2'
                      : i === 3
                        ? 'col-span-2 row-span-1'
                        : ''
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Image
                src={img}
                alt={`معرض الرهان الماسي ${i + 1}`}
                fill
                quality={90}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
