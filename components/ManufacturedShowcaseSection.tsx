"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Leaf, Droplets, Microwave } from 'lucide-react';

const SLIDES = [
  {
    src: '/assets/real/mfg_slide_lineup.png',
    title: 'تشكيلة المصنعات',
    subtitle: 'ستريبس · ناجتس · فيليه — جاهزة للقلي والفرن',
    href: `/products?category=${encodeURIComponent('مصنعات الدجاج')}`,
  },
  {
    src: '/assets/real/mfg_slide_korean.png',
    title: 'ستريبس بالخلطة الكورية',
    subtitle: 'نكهة حرّاقة من صدور دجاج سعودي طازج',
    href: `/products?category=${encodeURIComponent('مصنعات الدجاج')}`,
  },
  {
    src: '/assets/real/mfg_slide_veggie.png',
    title: 'ستريبس وناجتس بقشرة الخضار',
    subtitle: 'مقرمش · بدون دهون متحولة · ملائم للقلاية الهوائية',
    href: `/products?category=${encodeURIComponent('مصنعات الدجاج')}`,
  },
] as const;

const BENEFITS = [
  {
    icon: Leaf,
    label: 'بدون مواد حافظة وألوان اصطناعية',
  },
  {
    icon: Droplets,
    label: 'بدون دهون متحولة',
  },
  {
    icon: Microwave,
    label: 'ملائم للقلاية الهوائية',
  },
] as const;

export default function ManufacturedShowcaseSection() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(next, 5500);
    return () => window.clearInterval(id);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section
      className="py-12 md:py-20 relative overflow-hidden"
      id="المصنعات"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-deep/[0.03] via-transparent to-orange-accent/[0.05] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-orange-accent text-xs font-bold tracking-[0.2em] uppercase mb-2 font-cairo">
            مصنعات الدجاج
          </p>
          <h2 className="font-cairo text-2xl md:text-4xl font-black text-blue-deep">
            نقدم لكم الأفضل على مائدتكم
          </h2>
          <p className="mt-2 font-tajawal text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            ستريبس بأنواعه وناجتس وفيليه — من صدور دجاج سعودي طازج بعلامة الرهان الماسي.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden luxury-shadow-lg border border-white/70 bg-blue-deep">
          <div className="relative aspect-[16/10] md:aspect-[21/9] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.src}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 1100px"
                  className="object-cover object-center"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/85 via-blue-deep/25 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 inset-x-0 p-5 md:p-8">
              <p className="inline-flex mb-2 px-2.5 py-0.5 rounded-full bg-orange-accent/90 text-white text-[10px] font-cairo font-bold">
                100% سعودي
              </p>
              <h3 className="font-cairo text-xl md:text-3xl font-black text-white leading-snug">
                {slide.title}
              </h3>
              <p className="font-tajawal text-white/85 text-xs md:text-sm mt-1 mb-4 max-w-lg">
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-deep font-cairo font-bold text-sm rounded-full hover:bg-orange-accent hover:text-white transition-colors"
              >
                تصفح المصنعات
                <ArrowLeft size={16} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-2 py-3 bg-blue-deep/95">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`شريحة ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-7 bg-orange-accent' : 'w-2 bg-white/35 hover:bg-white/55'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-white/90 border border-blue-deep/8 luxury-shadow px-4 py-3.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-accent/20 to-blue-deep/10 text-blue-deep border border-orange-accent/30">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="font-tajawal text-xs md:text-sm font-bold text-blue-deep leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
