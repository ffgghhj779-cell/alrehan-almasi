"use client";

import { motion } from 'motion/react';
import {
  ShieldCheck,
  Truck,
  Snowflake,
  TrendingUp,
  Handshake,
  Headset,
  type LucideIcon,
} from 'lucide-react';

type Feature = {
  title: string;
  icon: LucideIcon;
  desc: string;
  accent: string;
};

const features: Feature[] = [
  {
    title: 'ضمان الجودة',
    icon: ShieldCheck,
    desc: 'أعلى معايير الجودة العالمية في انتقاء وتخزين المنتجات.',
    accent: 'from-green-accent/15 to-green-accent/5',
  },
  {
    title: 'توصيل سريع',
    icon: Truck,
    desc: 'أسطول متكامل لضمان وصول طلبياتك في الوقت المحدد.',
    accent: 'from-blue-primary/15 to-blue-primary/5',
  },
  {
    title: 'سلسلة تبريد متكاملة',
    icon: Snowflake,
    desc: 'مستودعات ومركبات مبردة للحفاظ على نضارة المنتجات.',
    accent: 'from-cyan-500/15 to-cyan-500/5',
  },
  {
    title: 'أسعار تنافسية',
    icon: TrendingUp,
    desc: 'نقدم أفضل الأسعار لعملائنا في قطاع الجملة والشركات.',
    accent: 'from-orange-accent/15 to-orange-accent/5',
  },
  {
    title: 'توريد موثوق',
    icon: Handshake,
    desc: 'شراكات استراتيجية لضمان استمرارية التوريد دون انقطاع.',
    accent: 'from-blue-deep/15 to-blue-deep/5',
  },
  {
    title: 'خدمة عملاء احترافية',
    icon: Headset,
    desc: 'فريق دعم متخصص لخدمتك وتلبية احتياجاتك على مدار الساعة.',
    accent: 'from-violet-500/15 to-violet-500/5',
  },
];

function FeatureCard({ feat, index, compact = false }: { feat: Feature; index: number; compact?: boolean }) {
  return (
    <div
      className={compact ? 'shrink-0 w-[280px] snap-start' : ''}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl h-full touch-press active:scale-[0.98] transition-transform ${
          compact ? 'p-5 min-h-[200px]' : 'p-6 md:p-8'
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-accent to-green-accent opacity-80" />

        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white luxury-shadow flex items-center justify-center mb-4 ring-1 ring-blue-primary/10">
          <feat.icon className="text-blue-primary" size={compact ? 24 : 28} aria-hidden="true" />
        </div>

        <h3 className="font-cairo font-bold text-base md:text-xl text-white mb-2">{feat.title}</h3>
        <p className="text-white/70 leading-relaxed font-tajawal text-sm md:text-base line-clamp-3">
          {feat.desc}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="py-12 md:py-20 bg-blue-deep overflow-x-hidden relative" id="المميزات">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-primary/40 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-8 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="font-cairo text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            لماذا تختار الرهان الماسي؟
          </h2>
          <div className="w-20 md:w-24 h-1 bg-orange-accent mx-auto rounded-full" />
          <p className="mt-4 text-sm md:text-base text-white/70 font-tajawal max-w-lg mx-auto">
            شريك توريد موثوق للمطاعم والفنادق والأسواق في المملكة
          </p>
        </motion.div>

        {/* Mobile: premium horizontal carousel */}
        <div className="md:hidden -mx-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-3">
            {features.map((feat, index) => (
              <FeatureCard key={feat.title} feat={feat} index={index} compact />
            ))}
          </div>
          <p className="text-center text-[11px] text-gray-400 font-tajawal mt-1">← اسحب لاستكشاف المميزات</p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feat, index) => (
            <FeatureCard key={feat.title} feat={feat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
