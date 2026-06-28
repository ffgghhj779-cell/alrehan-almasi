"use client";

import { motion } from 'motion/react';
import {
  ShieldCheck,
  Truck,
  Snowflake,
  TrendingUp,
  Handshake,
  Headset,
} from 'lucide-react';

const features = [
  {
    title: 'ضمان الجودة',
    icon: ShieldCheck,
    desc: 'أعلى معايير الجودة العالمية في انتقاء وتخزين المنتجات.',
  },
  {
    title: 'توصيل سريع',
    icon: Truck,
    desc: 'أسطول متكامل لضمان وصول طلبياتك في الوقت المحدد.',
  },
  {
    title: 'سلسلة تبريد متكاملة',
    icon: Snowflake,
    desc: 'مستودعات ومركبات مبردة للحفاظ على نضارة المنتجات.',
  },
  {
    title: 'أسعار تنافسية',
    icon: TrendingUp,
    desc: 'نقدم أفضل الأسعار لعملائنا في قطاع الجملة والشركات.',
  },
  {
    title: 'توريد موثوق',
    icon: Handshake,
    desc: 'شراكات استراتيجية لضمان استمرارية التوريد دون انقطاع.',
  },
  {
    title: 'خدمة عملاء احترافية',
    icon: Headset,
    desc: 'فريق دعم متخصص لخدمتك وتلبية احتياجاتك على مدار الساعة.',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary to-primary" id="المميزات">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="font-cairo text-3xl md:text-5xl font-bold text-blue-deep mb-4">
            لماذا تختار الرهان الماسي؟
          </h2>
          <div className="w-24 h-1 bg-orange-accent mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              className="bg-white p-8 luxury-shadow hover:luxury-shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-accent group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary rounded-sm opacity-50 group-hover:scale-150 group-hover:rotate-45 transition-transform duration-500 ease-out -z-10" />

              <div className="w-16 h-16 bg-primary flex items-center justify-center mb-6 group-hover:bg-orange-accent transition-colors duration-300 border border-gray-100 group-hover:border-orange-accent">
                <feat.icon
                  className="text-blue-primary group-hover:text-white transition-colors duration-300"
                  size={32}
                />
              </div>
              <h3 className="font-cairo font-bold text-2xl text-text-dark mb-3">{feat.title}</h3>
              <p className="text-gray-600 leading-relaxed font-tajawal text-lg">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
