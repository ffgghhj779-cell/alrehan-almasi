"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import { Phone, MessageCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] md:min-h-[700px] flex items-center px-4 md:px-12 pt-[calc(5.5rem+env(safe-area-inset-top))] md:pt-32 pb-16 md:pb-0 overflow-hidden"
      id="الرئيسية"
    >
      {/* Farm background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1548550160-a93f6a1a10c4?w=1920&h=1080&q=90&auto=format&fit=crop&crop=center"
          alt="مزرعة دواجن الرهان الماسي"
          fill
          quality={100}
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        {/* Deep overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-blue-deep/90 via-blue-deep/75 to-blue-deep/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/60 via-transparent to-transparent" />
      </div>

      {/* Decorative rings */}
      <div className="absolute right-12 top-1/4 w-[320px] h-[320px] rounded-full border border-secondary/20 border-dashed animate-[spin_40s_linear_infinite] hidden md:block" />
      <div className="absolute right-20 top-1/4 translate-y-8 w-[220px] h-[220px] rounded-full border border-secondary/10 hidden md:block" />

      {/* Seamless blend at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 md:h-32 bg-gradient-to-b from-transparent to-primary z-[5] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto relative z-10 w-full space-y-6 md:space-y-8 flex flex-col items-center text-center max-w-4xl pt-10 md:pt-20">

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-2 h-2 rounded-full bg-green-bright animate-pulse shrink-0" />
          <span className="text-white/90 text-xs font-bold font-tajawal tracking-widest uppercase">
            الرهان الماسي للدواجن
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="font-tajawal font-bold leading-tight text-white drop-shadow-xl flex flex-col items-center gap-2 md:gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-4xl md:text-5xl lg:text-[4rem]">مؤسسة الرهان الماسي</span>
          <span className="text-3xl md:text-4xl lg:text-[3rem] text-transparent bg-clip-text bg-gradient-to-l from-orange-accent to-yellow-300">للدواجن</span>
        </motion.h1>

        {/* Premium Slogan */}
        <motion.div
          className="flex items-center justify-center w-full mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="p-1.5 bg-gradient-to-br from-orange-accent to-yellow-500 rounded-lg shadow-inner">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <p className="text-white/95 text-lg md:text-2xl font-bold font-tajawal tracking-wide">
              من المزرعة إلى المائدة
            </p>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-sm md:text-lg text-white/70 leading-relaxed max-w-2xl font-tajawal pt-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          نقدم أجود أنواع الدواجن المبردة والمجمدة والبيض واللحوم بمعايير جودة عالمية،
          ملتزمون بأعلى معايير الذبح الحلال وسلامة الغذاء.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 pt-6 w-full max-w-sm sm:max-w-none items-stretch sm:items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
        >
          <a
            href="/#منتجاتنا"
            className="w-full sm:w-auto sm:min-w-[200px] min-h-[52px] px-8 py-3.5 bg-orange-accent text-white font-bold text-base luxury-shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-orange-accent/90 rounded-2xl touch-press hover:-translate-y-1"
          >
            <span>تصفح منتجاتنا</span>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <a
            href="https://wa.me/966560706018"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto sm:min-w-[200px] min-h-[52px] px-8 py-3.5 bg-transparent border-2 border-white/30 text-white font-bold text-base hover:bg-white/10 flex items-center justify-center gap-3 transition-all duration-300 rounded-2xl touch-press hover:-translate-y-1"
          >
            <span dir="ltr" className="tracking-wider">+966 56 070 6018</span>
            <Phone size={20} className="text-orange-accent shrink-0" />
          </a>
        </motion.div>

      </div>

      {/* Floating stats card */}
      <motion.div
        className="absolute bottom-12 left-8 md:left-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hidden md:flex items-center gap-4 z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="text-center px-4 border-l border-white/20">
          <div className="text-secondary text-2xl font-black font-cairo">+10</div>
          <div className="text-white/70 text-xs font-tajawal">سنوات خبرة</div>
        </div>
        <div className="text-center px-4 border-l border-white/20">
          <div className="text-secondary text-2xl font-black font-cairo">100%</div>
          <div className="text-white/70 text-xs font-tajawal">حلال معتمد</div>
        </div>
        <div className="text-center px-4">
          <div className="text-secondary text-2xl font-black font-cairo">24/7</div>
          <div className="text-white/70 text-xs font-tajawal">خدمة مستمرة</div>
        </div>
      </motion.div>
    </section>
  );
}
