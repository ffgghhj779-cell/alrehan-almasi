"use client";

import { motion } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function QualitySection() {
  return (
    <section className="bg-transparent py-16 md:py-24 relative overflow-hidden" dir="rtl">
      <div className="container mx-auto px-6 md:px-8 max-w-5xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Composition */}
          <motion.div 
            className="w-full lg:w-1/2 relative flex justify-center mt-8 lg:mt-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            {/* The offset shadow box */}
            <div className="absolute right-8 top-8 md:right-16 md:top-12 w-[85%] aspect-square bg-shape-olive z-0" />
            
            {/* The main image box */}
            <div className="relative z-10 w-[85%] aspect-square bg-blue-deep flex items-center justify-center p-4">
              <div className="relative w-full h-full">
                <Image 
                  src="/assets/nugget-fork.png" 
                  alt="جودة فائقة - الرهان الماسي"
                  fill
                  quality={100}
                  className="object-contain scale-110"
                />
              </div>
              
              {/* Decorative Carousel Arrows (Static to match design) */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="w-10 h-10 bg-blue-primary flex items-center justify-center text-white/50 cursor-pointer hover:text-white transition-colors">
                  <ChevronLeft size={20} />
                </div>
                <div className="w-10 h-10 bg-blue-primary flex items-center justify-center text-white/50 cursor-pointer hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-cairo text-3xl md:text-5xl font-black text-blue-deep leading-[1.3] mb-6">
              صُنع بجودة وعناية فائقة في كل خطوة من خطوات التصنيع.
            </h2>
            <p className="font-tajawal text-lg md:text-xl text-blue-deep leading-relaxed opacity-90 font-medium">
              نحن مرتبطون ارتباطاً وثيقاً بتراثنا العريق وبلدنا. نعدكم بتقديم أجود أنواع الدواجن إلى موائدكم، لنجعل كل وجبة وجبة صحية لكم ولعائلاتكم.
            </p>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
