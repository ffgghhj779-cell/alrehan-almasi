"use client";

import { motion } from 'motion/react';
import { Check, X, Sparkles } from 'lucide-react';

const FRESH = [
  'اللون وردي فاتح',
  'الجلد مشدود ولامع',
  'اللحم متماسك',
  'رائحة طبيعية خفيفة',
] as const;

const NOT_FRESH = [
  'اللون رمادي أو باهت',
  'الجلد مترهل',
  'اللحم لزج وطري',
  'رائحة قوية وغير طبيعية',
] as const;

export default function FreshnessGuideSection() {
  return (
    <section
      className="py-14 md:py-20 relative overflow-hidden"
      id="دليل-الطزاجة"
      dir="rtl"
    >
      <div className="absolute top-1/2 left-0 w-[420px] h-[420px] bg-green-accent/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[360px] h-[360px] bg-orange-accent/10 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue-deep/5 border border-blue-deep/10">
            <Sparkles size={14} className="text-orange-accent" />
            <span className="text-[11px] font-cairo font-bold text-blue-deep/80">
              دليل الجودة • الرهان الماسي
            </span>
          </div>
          <h2 className="font-cairo text-2xl md:text-4xl font-black text-blue-deep leading-tight">
            كيف تعرف{' '}
            <span className="text-green-accent">الدجاج الطازج</span>؟
          </h2>
          <p className="mt-3 font-tajawal text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            علامات بسيطة تساعدك تميّز الدجاج الطازج قبل الشراء — لأن جودة مائدتكم تبدأ من اختيار صحيح.
          </p>
          <div className="mx-auto mt-4 w-16 h-1 bg-orange-accent rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          <motion.article
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl border border-green-accent/25 bg-gradient-to-b from-green-accent/10 to-white p-6 md:p-8 luxury-shadow overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-green-accent to-green-accent/40" />
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-accent text-white shadow-lg shadow-green-accent/25">
                <Check size={22} strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-cairo text-xl md:text-2xl font-black text-blue-deep">
                  الدجاج الطازج
                </h3>
                <p className="font-tajawal text-xs text-green-accent">
                  معايير الرهان الماسي
                </p>
              </div>
            </div>
            <ul className="space-y-3.5">
              {FRESH.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-accent/15 text-green-accent">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="font-tajawal text-sm md:text-base font-semibold text-blue-deep/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative rounded-3xl border border-rose-200/80 bg-gradient-to-b from-rose-50/80 to-white p-6 md:p-8 luxury-shadow overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-rose-500 to-rose-300" />
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/25">
                <X size={22} strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-cairo text-xl md:text-2xl font-black text-rose-800">
                  الدجاج غير الطازج
                </h3>
                <p className="font-tajawal text-xs text-rose-700/70">
                  علامات يجب تجنبها
                </p>
              </div>
            </div>
            <ul className="space-y-3.5">
              {NOT_FRESH.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600">
                    <X size={14} strokeWidth={3} />
                  </span>
                  <span className="font-tajawal text-sm md:text-base font-semibold text-blue-deep/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center font-tajawal text-xs md:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed"
        >
          منتجات الرهان الماسي تُورَّد بسلسلة تبريد محكمة ومعايير ذبح حلال —
          لتصل إليكم طازجة كما يجب.
        </motion.p>
      </div>
    </section>
  );
}
