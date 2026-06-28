"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="من نحن">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="relative h-[500px] w-full overflow-hidden luxury-shadow border-4 border-white">
              <Image
                src="https://picsum.photos/seed/warehousefood/800/1000"
                alt="المستودعات والمرافق"
                fill
                quality={90}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white p-6 luxury-shadow border-l-4 border-orange-accent"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4">
                <div className="text-orange-accent text-4xl font-bold font-cairo">+10</div>
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
            <h2 className="font-cairo text-3xl md:text-5xl font-bold text-blue-deep mb-6">من نحن</h2>
            <div className="w-16 h-1 bg-orange-accent mb-8 rounded-full" />
            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-tajawal">
              الرهان الماسي شركة متخصصة في توريد المنتجات الغذائية الطازجة والمجمدة داخل المملكة
              العربية السعودية، ونقدم حلول توريد متكاملة للمطاعم والفنادق والأسواق المركزية
              وشركات التموين.
            </p>

            <div className="space-y-5">
              {[
                'تغطية شاملة لجميع مناطق المملكة',
                'أسطول مبرد مجهز بأحدث التقنيات',
                'التزام تام بمعايير الجودة وسلامة الغذاء',
                'أسعار تنافسية وحلول دفع مرنة للشركات',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-green-accent" size={20} />
                  </div>
                  <span className="text-text-dark font-semibold text-lg font-tajawal">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
