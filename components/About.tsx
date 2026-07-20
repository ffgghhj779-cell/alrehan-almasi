"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden" id="من نحن">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F5D5A0]/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          <motion.div
            className="lg:w-1/2 relative w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="relative h-[260px] sm:h-[380px] lg:h-[500px] w-full overflow-hidden luxury-shadow border-4 border-white rounded-xl">
              <Image
                src="/assets/chicken-chilled-bag-branded.png"
                alt="دواجن الرهان الماسي — منتجات مبردة"
                fill
                quality={90}
                className="object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 luxury-shadow border-l-4 border-[#E67E22] rounded-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4">
                <div className="text-[#E67E22] text-4xl font-bold font-cairo">+10</div>
                <div className="text-gray-600 font-bold leading-tight font-tajawal">
                  سنوات من
                  <br />
                  الخبرة
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="text-[#E67E22] text-xs font-bold tracking-[0.25em] uppercase mb-3 font-cairo">
              About Us • من نحن
            </p>
            <h2 className="font-cairo text-2xl md:text-5xl font-bold text-[#1B2B5E] mb-4 md:mb-6">
              مؤسسة الرهان الماسي للدواجن
            </h2>
            <div className="w-16 h-1 bg-[#E67E22] mb-5 md:mb-8 rounded-full" />
            <p className="text-sm md:text-lg text-gray-600 leading-relaxed mb-3 font-tajawal">
              مؤسسة الرهان الماسي للدواجن، شركة متخصصة في توريد الدواجن المبردة والمجمدة
              والبيض واللحوم داخل المملكة العربية السعودية.
            </p>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-6 md:mb-8 font-tajawal">
              نقدم حلول توريد متكاملة للمطاعم والفنادق والأسواق المركزية وشركات التموين،
              بمعايير جودة عالمية وسلسلة تبريد لا تنقطع.
            </p>

            <div className="space-y-5">
              {[
                'دجاج مبرد ومجمد بأعلى معايير الجودة',
                'بيض مائدة طازج يومياً',
                'لحوم أغنام (حري وسواكني) طازجة ومبردة',
                'مصنعات دجاج (استربس · زنجر · بانيه)',
                'التزام تام بمعايير الذبح الحلال وسلامة الغذاء',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#F5D5A0]/30 flex items-center justify-center shrink-0 rounded-lg">
                    <CheckCircle2 className="text-[#E67E22]" size={20} />
                  </div>
                  <span className="text-text-dark font-semibold text-sm md:text-base font-tajawal">{item}</span>
                </div>
              ))}
            </div>

            {/* Phone CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+966560706018"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2B5E] text-white font-cairo font-bold rounded-xl hover:bg-[#0f1d42] transition-colors"
              >
                📞 اتصل بنا
              </a>
              <a
                href="https://wa.me/966560706018"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-cairo font-bold rounded-xl hover:bg-green-600 transition-colors"
              >
                💬 واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
