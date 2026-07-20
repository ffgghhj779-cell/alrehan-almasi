import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import VideoSection from '@/components/VideoSection';
import About from '@/components/About';
import QualitySection from '@/components/QualitySection';
import Features from '@/components/Features';
import Products from '@/components/Products';
import Gallery from '@/components/Gallery';
import Clients from '@/components/Clients';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { fetchProductsResult } from '@/lib/products';

export const revalidate = 60;

export default async function Home() {
  const { products, error } = await fetchProductsResult(8);

  return (
    <main className="min-h-screen relative overflow-x-hidden mobile-contain">
      <Navbar />
      <Hero />
      <Categories />
      <VideoSection />
      <About />
      <QualitySection />
      <Features />
      <Products initialProducts={products} fetchError={error} />
      <Gallery />
      <Clients />
      <Footer />
      <Cart />
    </main>
  );
}
