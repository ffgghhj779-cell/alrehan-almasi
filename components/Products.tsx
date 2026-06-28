"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import ProductGrid from './ProductGrid';
import TierSelector from './TierSelector';
import type { Product } from '@/lib/products';

type ProductsProps = {
  initialProducts?: Product[];
  fetchError?: string | null;
};

export default function Products({ initialProducts, fetchError }: ProductsProps) {
  return (
    <section className="py-12 md:py-20 bg-white overflow-x-hidden" id="منتجاتنا">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] overflow-x-hidden">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div>
            <h2 className="font-cairo text-2xl md:text-5xl font-bold text-blue-deep mb-3 md:mb-4">
              المنتجات المميزة
            </h2>
            <div className="w-20 md:w-24 h-1 bg-orange-accent rounded-full" />
          </div>
          <Link
            href="/products"
            className="text-sm md:text-base text-blue-primary font-bold hover:text-orange-accent transition-colors flex items-center gap-2 touch-press"
          >
            عرض كل المنتجات <span className="text-xl leading-none">&larr;</span>
          </Link>
        </motion.div>

        <TierSelector />

        <div className="mt-6 md:mt-8">
          <ProductGrid
            initialProducts={initialProducts}
            limit={8}
            fetchError={fetchError}
          />
        </div>
      </div>
    </section>
  );
}
