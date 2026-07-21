"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import { CheckCircle2, Leaf, ShieldCheck, Sun } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'تغذية نباتية 100%',
    description: 'نعتمد على أعلاف نباتية طبيعية خالية من أي إضافات حيوانية لضمان جودة ونقاء الدواجن.',
  },
  {
    icon: ShieldCheck,
    title: 'أعلى معايير الجودة',
    description: 'نطبق أدق معايير السلامة الغذائية والتعقيم في جميع مراحل التربية والإنتاج.',
  },
  {
    icon: Sun,
    title: 'بيئة طبيعية مفتوحة',
    description: 'نحرص على توفير بيئة صحية خالية من الإجهاد للطيور لضمان أفضل طعم.',
  },
];

export default function FarmSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-green-50/50 rounded-bl-[100px] md:rounded-bl-[200px] -z-10" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-[30px] overflow-hidden luxury-shadow-2xl">
              <Image
                src="/assets/real/brand_chicken_chilled_basket_ad.png"
                alt="دجاج طازج مبرد من مزارع الرهان الماسي"
                fill
                className="object-cover filter contrast-[1.05] saturate-[1.05]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                  <p className="text-white font-tajawal text-sm md:text-base leading-relaxed text-shadow-sm">
                    {"\"نحن في الرهان الماسي نؤمن بأن الجودة تبدأ من المزرعة، ولذلك نولي اهتماماً فائقاً ببيئة التربية لنقدم لكم أفضل المنتجات.\""}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-6 -right-6 md:top-8 md:-right-12 bg-white rounded-full p-4 luxury-shadow-xl border-4 border-green-50 flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 z-10"
            >
              <span className="text-green-accent font-black text-2xl md:text-3xl font-cairo">100%</span>
              <span className="text-gray-600 font-tajawal text-[10px] md:text-xs text-center font-bold">إنتاج محلي<br/>طازج يومياً</span>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-accent text-sm font-bold font-cairo mb-6 w-fit">
              <Leaf size={16} />
              من المزرعة إلى مائدتك
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-cairo text-blue-deep mb-6 leading-[1.3]">
              مزارعنا هي سر <br className="hidden md:block"/>
              <span className="text-green-accent">جودتنا وتميزنا</span>
            </h2>
            
            <p className="text-gray-600 font-tajawal text-base md:text-lg mb-10 leading-relaxed max-w-xl">
              تعتبر مزارع الرهان الماسي من أحدث المزارع التي تعتمد على التكنولوجيا المتطورة في التربية، مع الحفاظ الكامل على المعايير الطبيعية والبيئية لنقدم لعملائنا منتجات صحية وآمنة.
            </p>

            <div className="flex flex-col gap-6 md:gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-primary flex items-center justify-center">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold font-cairo text-blue-deep text-lg mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-500 font-tajawal text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
