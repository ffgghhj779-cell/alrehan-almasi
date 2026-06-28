import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductGrid from '@/components/ProductGrid';
import TierSelector from '@/components/TierSelector';
import { fetchProductsResult } from '@/lib/products';

export const revalidate = 60;

export default async function ProductsPage() {
  const { products, error } = await fetchProductsResult();

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary via-secondary/30 to-primary">
      <Navbar />
      <section className="pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
          <div className="mb-10">
            <h1 className="font-cairo text-3xl md:text-5xl font-bold text-blue-deep mb-4">
              دليل المنتجات
            </h1>
            <div className="w-24 h-1 bg-orange-accent rounded-full mb-4" />
            <p className="text-gray-600 font-tajawal text-lg max-w-2xl">
              تصفح كامل قائمة منتجات الرهان الماسي مع أسعار الجملة المخصصة حسب مستوى
              عميلك B2B.
            </p>
          </div>
          <TierSelector />
          <div className="mt-8">
            <ProductGrid
              initialProducts={products}
              showSearch
              fetchError={error}
            />
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
