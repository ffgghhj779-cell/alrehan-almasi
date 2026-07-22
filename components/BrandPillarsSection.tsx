"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Bird, HeartPulse, ArrowLeft } from 'lucide-react';

const PILLARS = [
  {
    icon: Bird,
    eyebrow: 'جودة المنتج',
    title: 'دواجن عالية الجودة',
    body: 'دجاجنا يُربّى محلياً في بيئة مفتوحة، ويُغذّى يومياً بأعلاف نباتية مختارة، وينمو بشكل طبيعي دون هرمونات. نلتزم بأعلى معايير الرعاية البيطرية لنقدّم منتجاً طرياً وعصيراً يليق بمائدتكم.',
    cta: 'اعرف المزيد',
    href: '/#من نحن',
  },
  {
    icon: HeartPulse,
    eyebrow: 'سلسلة القيمة',
    title: 'الثروة الحيوانية وصحة الحيوان',
    body: 'نركّز دائماً على صحة القطيع لنضمن أعلى جودة. نعمل ضمن منظومة توريد موثوقة داخل المملكة — من الرعاية والتغذية إلى الذبح الحلال وسلسلة التبريد حتى باب منشأتكم.',
    cta: 'اعرف المزيد',
    href: '/#دليل-الطزاجة',
  },
] as const;

export default function BrandPillarsSection() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % PILLARS.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(next, 7000);
    return () => window.clearInterval(id);
  }, [next]);

  const pillar = PILLARS[index];
  const Icon = pillar.icon;

  return (
    <section
      className="py-14 md:py-20 relative overflow-hidden bg-white/40"
      id="قيمنا"
      dir="rtl"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-blue-deep/15 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 max-w-3xl relative text-center">
        <p className="font-cairo text-sm md:text-base font-bold text-blue-deep/70 mb-8">
          نقدم لكم الأفضل على مائدتكم
        </p>

        <div className="relative min-h-[340px] md:min-h-[300px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-deep/15 bg-gradient-to-br from-blue-deep/[0.06] to-orange-accent/10 text-blue-deep">
                <Icon size={40} strokeWidth={1.5} />
              </div>
              <p className="text-orange-accent text-[11px] font-cairo font-bold tracking-widest uppercase mb-2">
                {pillar.eyebrow}
              </p>
              <h2 className="font-cairo text-2xl md:text-3xl font-black text-blue-deep mb-4">
                {pillar.title}
              </h2>
              <p className="font-tajawal text-sm md:text-base text-gray-600 leading-relaxed max-w-xl mb-7">
                {pillar.body}
              </p>
              <Link
                href={pillar.href}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-deep text-white font-cairo font-bold text-sm hover:bg-orange-accent transition-colors"
              >
                {pillar.cta}
                <ArrowLeft size={16} aria-hidden />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2.5 mt-8">
          {PILLARS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`قيمة ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? 'w-8 bg-orange-accent'
                  : 'w-2.5 bg-blue-deep/20 hover:bg-blue-deep/35'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
