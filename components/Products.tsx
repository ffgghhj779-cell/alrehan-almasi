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
    <section className="py-20 sm:py-24 bg-white" id="منتجاتنا">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div>
            <h2 className="font-cairo text-3xl md:text-5xl font-bold text-blue-deep mb-4">
              المنتجات المميزة
            </h2>
            <div className="w-24 h-1 bg-orange-accent rounded-full" />
          </div>
          <Link
            href="/products"
            className="text-blue-primary font-bold hover:text-orange-accent transition-colors flex items-center gap-2"
          >
            عرض كل المنتجات <span className="text-xl leading-none">&larr;</span>
          </Link>
        </motion.div>

        <TierSelector />

        <div className="mt-8">
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
