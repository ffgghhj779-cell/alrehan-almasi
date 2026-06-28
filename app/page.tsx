import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import About from '@/components/About';
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
      <About />
      <Features />
      <Products initialProducts={products} fetchError={error} />
      <Gallery />
      <Clients />
      <Footer />
      <Cart />
    </main>
  );
}
