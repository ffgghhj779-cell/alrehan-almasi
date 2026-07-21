import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import ProductGrid from '@/components/ProductGrid';
import TierSelector from '@/components/TierSelector';
import { fetchProductsResult } from '@/lib/products';
import { Suspense } from 'react';

export const revalidate = 60;

export default async function ProductsPage() {
  const { products, error } = await fetchProductsResult();

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary via-secondary/30 to-primary overflow-x-hidden mobile-contain">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-20 sm:pb-24 overflow-x-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px] overflow-x-hidden">
          <div className="relative rounded-3xl overflow-hidden mb-12 luxury-shadow">
            <div className="absolute inset-0 bg-blue-deep">
              <img
                src="/assets/real/brand_supermarket_shelf.png"
                alt="دليل المنتجات"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-deep/95 via-blue-deep/80 to-transparent" />
            </div>
            <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 flex flex-col justify-center min-h-[300px]">
              <h1 className="font-cairo text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                دليل المنتجات الشامل
              </h1>
              <div className="w-20 h-1.5 bg-orange-accent rounded-full mb-6" />
              <p className="text-gray-200 font-tajawal text-sm md:text-lg max-w-xl leading-relaxed">
                تصفح كامل قائمة منتجات الرهان الماسي من الدواجن الطازجة والمجمدة بمعايير توريد احترافية وأسعار جملة مخصصة لك.
              </p>
            </div>
          </div>
          <TierSelector />
          <div className="mt-8">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center mx-auto w-full max-w-6xl">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-[420px] w-full max-w-[320px] skeleton-shimmer" />
                ))}
              </div>
            }>
              <ProductGrid
                initialProducts={products}
                showSearch
                fetchError={error}
              />
            </Suspense>
          </div>
        </div>
      </section>
      <Footer />
      <Cart />
    </main>
  );
}
