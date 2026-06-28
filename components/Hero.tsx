"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import { MagneticMotionAnchor } from './MagneticMotion';

export default function Hero() {
  return (
    <section
      className="relative h-[380px] md:h-[600px] flex items-center px-4 md:px-12 bg-gradient-to-l from-secondary via-primary to-white overflow-hidden"
      id="الرئيسية"
    >
      <div className="absolute left-0 top-0 w-1/2 h-full bg-blue-primary opacity-[0.04] skew-x-12 transform -translate-x-20" />
      <div className="absolute left-12 w-[340px] h-[340px] rounded-full border-2 border-orange-accent border-dashed opacity-20 animate-[spin_30s_linear_infinite]" />
      <div className="absolute left-24 w-[280px] h-[280px] rounded-full border border-green-accent opacity-15" />

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

      <div className="container mx-auto relative z-10 w-full md:w-2/3 space-y-6 flex flex-col items-start pt-20">
        <motion.div
          className="inline-block px-3 py-1 bg-white border-r-4 border-orange-accent text-xs font-bold text-orange-accent uppercase tracking-widest luxury-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Al Rehan Almasi • Premium Supply
        </motion.div>

        <motion.h1
          className="font-cairo text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-text-dark max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          شريكك الموثوق لتوريد <br />
          <span className="text-blue-primary">المنتجات الغذائية</span> الطازجة والمجمدة
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 leading-relaxed max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          نوفر أفضل الخضروات والفواكه والأسماك والدواجن والزيوت والأرز والمواد الغذائية للسوق
          السعودي بأعلى معايير الجودة العالمية واللوجستية.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <MagneticMotionAnchor
            href="#منتجاتنا"
            className="px-8 py-4 bg-orange-accent text-white font-bold luxury-shadow flex items-center justify-center gap-3 transition-colors duration-300 hover:bg-[#ea580c]"
          >
            <span>ابدأ التوريد الآن</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="px-8 py-4 border-2 border-orange-accent text-orange-accent font-bold text-center hover:bg-orange-accent hover:text-white transition-all duration-300"
          >
            تواصل معنا
          </a>
        </motion.div>
      </div>
    </section>
  );
}
