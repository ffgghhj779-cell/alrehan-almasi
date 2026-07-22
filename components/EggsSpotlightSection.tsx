"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EggsSpotlightSection() {
  return (
    <section
      className="py-12 md:py-20 relative overflow-hidden"
      id="البيض"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-deep/[0.04] via-transparent to-orange-accent/[0.06] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mb-8 md:mb-10 text-center md:text-right"
        >
          <p className="text-orange-accent text-xs font-bold tracking-[0.2em] uppercase mb-2 font-cairo">
            بيض المائدة • Eggs
          </p>
          <h2 className="font-cairo text-2xl md:text-4xl font-black text-blue-deep">
            بطل الوجبات الصحية
          </h2>
          <p className="mt-2 font-tajawal text-sm md:text-base text-gray-600 max-w-xl md:mr-0 mx-auto">
            بيض طازج يومياً بعلامة الرهان الماسي — تغذية موثوقة لموائدكم ومطاعمكم.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden luxury-shadow-lg border border-white/70 group"
        >
          <div className="relative aspect-[16/10] md:aspect-[21/9] w-full bg-blue-deep">
            <Image
              src="/assets/real/eggs_promo_banner.png"
              alt="بيض الرهان الماسي — بطل الوجبات الصحية"
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, 1100px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/80 via-blue-deep/20 to-transparent md:bg-gradient-to-l md:from-blue-deep/75 md:via-transparent md:to-transparent" />
          </div>

          <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 md:max-w-md md:mr-auto">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-accent" />
              <span className="text-white/90 text-[11px] font-cairo font-bold">
                الرهان الماسي
              </span>
            </div>
            <h3 className="font-cairo text-xl md:text-3xl font-black text-white leading-snug mb-2">
              طازج من المزرعة إلى مائدتكم
            </h3>
            <p className="font-tajawal text-white/80 text-xs md:text-sm mb-4 leading-relaxed">
              أصناف متعددة: ×6 · ×15 · ×30 — جاهزة للمنزل والتموين.
            </p>
            <Link
              href={`/products?category=${encodeURIComponent('بيض')}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-accent text-white font-cairo font-bold text-sm rounded-xl hover:bg-orange-accent/90 transition-colors"
            >
              تصفح أصناف البيض
              <ArrowLeft size={16} aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
