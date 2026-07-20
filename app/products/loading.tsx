import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoadingProducts() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary via-secondary/30 to-primary">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-20 sm:pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
          {/* Hero Skeleton */}
          <div className="relative rounded-3xl overflow-hidden mb-12 bg-gray-200 animate-pulse h-[300px]">
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-[360px] animate-pulse shadow-sm ring-1 ring-gray-100" />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
