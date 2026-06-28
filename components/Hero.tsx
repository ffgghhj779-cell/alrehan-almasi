"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import { MagneticMotionAnchor } from './MagneticMotion';

export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] md:min-h-0 md:h-[600px] flex items-center px-4 md:px-12 pt-[calc(4.5rem+env(safe-area-inset-top))] md:pt-0 pb-16 md:pb-0 bg-gradient-to-l from-secondary via-primary to-white overflow-hidden"
      id="الرئيسية"
    >
      <div className="absolute left-0 top-0 w-1/2 h-full bg-blue-primary opacity-[0.04] skew-x-12 transform -translate-x-20 hidden sm:block" />
      <div className="absolute left-12 w-[340px] h-[340px] rounded-full border-2 border-orange-accent border-dashed opacity-20 animate-[spin_30s_linear_infinite] hidden md:block" />
      <div className="absolute left-24 w-[280px] h-[280px] rounded-full border border-green-accent opacity-15 hidden md:block" />

      <div className="absolute right-0 top-0 w-full h-full mix-blend-multiply opacity-10 pointer-events-none z-0">
        <Image
          src="https://picsum.photos/seed/foodlogistics/1920/1080"
          alt="Fresh food logistics"
          fill
          quality={90}
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Seamless blend into Categories */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 md:h-48 bg-gradient-to-b from-transparent via-primary/60 to-primary z-[5] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto relative z-10 w-full md:w-2/3 space-y-4 sm:space-y-6 flex flex-col items-center md:items-start text-center md:text-right">
        <motion.div
          className="inline-block px-3 py-1 bg-white border-r-4 border-orange-accent text-[10px] sm:text-xs font-bold text-orange-accent uppercase tracking-widest luxury-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Al Rehan Almasi • Premium Supply
        </motion.div>

        <motion.h1
          className="font-cairo text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-text-dark max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          شريكك الموثوق لتوريد{' '}
          <span className="text-blue-primary">المنتجات الغذائية</span> الطازجة والمجمدة
        </motion.h1>

        <motion.p
          className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          نوفر أفضل الخضروات والفواكه والأسماك والدواجن والزيوت والأرز والمواد الغذائية للسوق
          السعودي بأعلى معايير الجودة العالمية واللوجستية.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full max-w-md sm:max-w-none sm:w-auto items-stretch sm:items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <MagneticMotionAnchor
            href="#منتجاتنا"
            className="w-full sm:w-auto sm:min-w-[200px] min-h-[48px] px-6 py-3.5 bg-orange-accent text-white font-bold text-sm sm:text-base luxury-shadow flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-[#ea580c] rounded-xl touch-press active:scale-[0.98]"
          >
            <span>ابدأ التوريد الآن</span>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </MagneticMotionAnchor>
          <a
            href="#تواصل معنا"
            className="w-full sm:w-auto sm:min-w-[200px] min-h-[48px] px-6 py-3.5 border-2 border-orange-accent text-orange-accent font-bold text-sm sm:text-base flex items-center justify-center rounded-xl hover:bg-orange-accent hover:text-white transition-all duration-300 touch-press active:scale-[0.98]"
          >
            تواصل معنا
          </a>
        </motion.div>
      </div>
    </section>
  );
}
