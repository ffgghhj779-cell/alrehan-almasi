"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function ProductionStorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-primary via-white to-primary"
      id="سلسلة-الإنتاج"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-accent/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-orange-accent text-xs font-bold tracking-[0.25em] uppercase mb-3 font-cairo">
            Our Production Story
          </p>
          <h2 className="font-cairo text-2xl md:text-5xl font-bold text-blue-deep mb-4">
            من المزرعة إلى السوق
          </h2>
          <div className="w-20 h-1 bg-orange-accent mx-auto rounded-full mb-5" />
          <p className="text-gray-600 text-sm md:text-lg font-tajawal max-w-2xl mx-auto leading-relaxed">
            شاهد كيف تعمل مزارعنا المعيارية ومصنعنا المعقّم وتعبئتنا حسب الطلب لتلبية احتياجات الأسواق المختلفة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] gap-10 md:gap-14 items-center justify-items-center lg:justify-items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full max-w-[300px] md:max-w-[340px]"
          >
            <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-blue-deep/10 via-orange-accent/10 to-transparent blur-sm" />
            <div className="relative rounded-3xl overflow-hidden luxury-shadow-lg border border-blue-deep/10 bg-blue-deep">
              <div className="px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
                <div className="w-2 h-2 rounded-full bg-orange-accent" />
                <span className="text-white/70 text-[10px] font-cairo font-bold tracking-wide">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="w-full grid sm:grid-cols-2 gap-4 md:gap-5"
          >
            {[
              {
                step: '01',
                title: 'مزارع معيارية',
                desc: 'تربية موحّدة في مزارع ذاتية التشغيل بمعايير جودة عالية',
              },
              {
                step: '02',
                title: 'مصنع إنتاج خاص',
                desc: 'خطوط إنتاج نظيفة ومعقّمة يومياً في بيئة خالية من الغبار',
              },
              {
                step: '03',
                title: 'سلامة وتعقيم',
                desc: 'التزام كامل ببروتوكولات النظافة وممرات التعقيم للعاملين',
              },
              {
                step: '04',
                title: 'تعبئة حسب الطلب',
                desc: 'مواصفات وأشكال تعبئة مخصصة للمطاعم والفنادق والتموين',
              },
              {
                step: '05',
                title: 'توريد للأسواق',
                desc: 'سلسلة توريد تلبي احتياجات العملاء والأسواق المختلفة',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className={`rounded-2xl bg-white border border-blue-deep/8 p-5 luxury-shadow ${
                  i === 4 ? 'sm:col-span-2 sm:max-w-md sm:mx-auto' : ''
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.08 }}
              >
                <span className="text-orange-accent font-cairo font-black text-sm tracking-widest">
                  {item.step}
                </span>
                <h3 className="font-cairo font-bold text-blue-deep text-lg mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 font-tajawal text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
