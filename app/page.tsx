import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import EggsSpotlightSection from '@/components/EggsSpotlightSection';
import ManufacturedShowcaseSection from '@/components/ManufacturedShowcaseSection';
import FarmSection from '@/components/FarmSection';
import ProductionStorySection from '@/components/ProductionStorySection';
import VideoSection from '@/components/VideoSection';
import About from '@/components/About';
import QualitySection from '@/components/QualitySection';
import FreshnessGuideSection from '@/components/FreshnessGuideSection';
import BrandPillarsSection from '@/components/BrandPillarsSection';
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
      <EggsSpotlightSection />
      <ManufacturedShowcaseSection />
      <FarmSection />
      <ProductionStorySection />
      <VideoSection />
      <About />
      <QualitySection />
      <FreshnessGuideSection />
      <BrandPillarsSection />
      <Features />
      <Products initialProducts={products} fetchError={error} />
      <Gallery />
      <Clients />
      <Footer />
      <Cart />
    </main>
  );
}
