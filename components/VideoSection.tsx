"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function VideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1B2B5E 0%, #0f1d42 60%, #1B2B5E 100%)' }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E67E22] via-[#F5D5A0] to-[#E67E22]" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E67E22] via-[#F5D5A0] to-[#E67E22]" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-[#F5D5A0]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full bg-[#E67E22]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#F5D5A0]/60 text-xs font-bold tracking-[0.25em] uppercase mb-3 font-cairo">
            Farm · Plant · Market
          </p>

          <h2 className="font-cairo text-3xl md:text-5xl font-black text-white mb-4">
            من <span className="text-[#F5D5A0]">المزرعة</span> إلى <span className="text-[#E67E22]">السوق</span>
          </h2>

          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-16 h-[2px] bg-[#E67E22]/50" />
            <div className="w-2 h-2 rounded-full bg-[#F5D5A0]" />
            <div className="w-16 h-[2px] bg-[#E67E22]/50" />
          </div>

          <p className="text-white/70 text-sm md:text-lg font-tajawal max-w-2xl mx-auto leading-relaxed">
            شاهد سلسلة الإنتاج المتكاملة: مزارع معيارية، مصنع تعقيم يومي، تعبئة حسب الطلب، وتوريد يلبي احتياجات الأسواق المختلفة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] gap-8 md:gap-12 items-center justify-items-center lg:justify-items-stretch">
          {/* Portrait video — matches source 9:16 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-[320px] md:max-w-[360px]"
          >
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[#F5D5A0]/20 via-[#E67E22]/10 to-[#F5D5A0]/5 blur-sm" />

            <div className="relative rounded-2xl overflow-hidden border border-[#F5D5A0]/20 shadow-2xl bg-black">
              <div className="bg-[#0f1d42] px-4 py-2.5 flex items-center gap-2 border-b border-[#F5D5A0]/10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <span className="mr-auto text-[#F5D5A0]/60 text-[10px] font-cairo">
                  سلسلة إنتاج الرهان الماسي
                </span>
              </div>

              <video
                className="w-full aspect-[9/16] object-cover bg-black"
                controls
                preload="metadata"
                poster="/assets/real/farm_to_market_poster.jpg"
                playsInline
              >
                <source src="/assets/real/farm_to_market.mp4" type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
            </div>

            <div className="mt-3 flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-xs font-bold font-cairo">
                  مزارع معيارية · مصنع معقّم · توريد احترافي
                </span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="space-y-6 w-full"
          >
            {[
              {
                en: 'Standardized Farms',
                ar: 'مزارع معيارية عالية الجودة',
                desc: 'مزارع ذاتية التشغيل بمعايير تربية موحّدة لضمان صحة الدواجن وجودة اللحم',
                icon: '🐔',
              },
              {
                en: 'Own Production Plant',
                ar: 'مصنع إنتاج خاص',
                desc: 'خط إنتاج موحّد ومعقّم يومياً في بيئة خالية من الغبار لضمان أعلى معايير النظافة',
                icon: '🏭',
              },
              {
                en: 'Hygiene & Disinfection',
                ar: 'تعقيم وسلامة غذائية',
                desc: 'ورش الإنتاج تُعقَّم يومياً مع التزام كامل بملابس وممرات التعقيم للعاملين',
                icon: '✅',
              },
              {
                en: 'Custom Packaging',
                ar: 'تعبئة حسب الطلب',
                desc: 'نخصص المواصفات وأشكال التعبئة لتناسب متطلبات المطاعم والفنادق والتموين',
                icon: '📦',
              },
              {
                en: 'Market Supply',
                ar: 'توريد يلبي الأسواق',
                desc: 'سلسلة توريد متكاملة تلبي احتياجات الأسواق والعملاء المختلفين بكفاءة عالية',
                icon: '🚢',
              },
            ].map((item, i) => (
              <motion.div
                key={item.en}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5D5A0]/10 border border-[#F5D5A0]/20 flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[#F5D5A0]/60 text-[10px] tracking-widest uppercase font-bold mb-0.5">
                    {item.en}
                  </p>
                  <h3 className="text-white font-cairo font-bold text-base md:text-lg">{item.ar}</h3>
                  <p className="text-white/55 text-sm font-tajawal leading-relaxed mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
