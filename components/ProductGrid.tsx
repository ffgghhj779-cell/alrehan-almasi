"use client";

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PackageOpen } from 'lucide-react';
import { ProductItem } from './ProductItem';
import ProductSearchBar from './ProductSearchBar';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { fetchProductsResult, type Product } from '@/lib/products';

type ProductGridProps = {
  initialProducts?: Product[];
  limit?: number;
  showSearch?: boolean;
  fetchError?: string | null;
};

function filterProducts(
  products: Product[],
  query: string,
  category: string | null
): Product[] {
  const normalized = query.trim().toLowerCase();
  return products.filter((p) => {
    const matchesCategory = !category || p.category === category;
    const matchesQuery =
      !normalized ||
      p.name.toLowerCase().includes(normalized) ||
      p.sku.toLowerCase().includes(normalized) ||
      p.category.toLowerCase().includes(normalized);
    return matchesCategory && matchesQuery;
  });
}

export default function ProductGrid({
  initialProducts,
  limit,
  showSearch = false,
  fetchError: initialError = null,
}: ProductGridProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const hasInitialData = Boolean(initialProducts?.length);
  const [products, setProducts] = useState<Product[]>(() =>
    hasInitialData
      ? limit
        ? initialProducts!.slice(0, limit)
        : initialProducts!
      : []
  );
  const [isLoading, setIsLoading] = useState(!hasInitialData);
  const [error, setError] = useState<string | null>(initialError);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);

  // Sync with URL changes if user uses back/forward navigation
  useEffect(() => {
    setActiveCategory(searchParams.get('category'));
  }, [searchParams]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProductsResult(limit);
      setProducts(result.products);
      if (result.error) setError(result.error);
    } catch {
      setError('حدث خطأ غير متوقع أثناء تحميل المنتجات.');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  const filtered = useMemo(
    () => filterProducts(products, query, activeCategory),
    [products, query, activeCategory]
  );

  const skeletonCount = limit ?? 8;

  return (
    <>
      {showSearch && !isLoading && products.length > 0 && (
        <ProductSearchBar
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          resultCount={filtered.length}
        />
      )}

      {showSearch && activeCategory === 'بيض' && !isLoading && (
        <div className="relative w-full max-w-6xl mx-auto mb-8 rounded-3xl overflow-hidden luxury-shadow border border-white/70">
          <div className="relative aspect-[21/9] min-h-[160px] w-full bg-blue-deep">
            <Image
              src="/assets/real/eggs_promo_banner.png"
              alt="بيض الرهان الماسي — بطل الوجبات الصحية"
              fill
              quality={85}
              sizes="(max-width: 768px) 100vw, 1100px"
              className="object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/70 via-transparent to-blue-deep/20" />
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 text-right">
              <p className="font-cairo font-black text-white text-lg md:text-2xl drop-shadow">
                بطل الوجبات الصحية
              </p>
              <p className="font-tajawal text-white/85 text-xs md:text-sm mt-1">
                بيض طازج بعلامة الرهان الماسي
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center mx-auto w-full max-w-6xl">
        {isLoading &&
          Array(skeletonCount)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl flex flex-col h-[420px] w-full max-w-[320px] overflow-hidden ring-1 ring-gray-100"
                aria-hidden="true"
              >
                <div className="h-56 bg-orange-accent/10 w-full skeleton-shimmer" />
                <div className="p-6 flex flex-col flex-grow gap-3">
                  <div className="h-6 bg-gray-200 rounded-sm w-3/4 skeleton-shimmer" />
                  <div className="h-4 bg-gray-200 rounded-sm w-1/2 skeleton-shimmer" />
                  <div className="h-4 bg-gray-200 rounded-sm w-1/4 skeleton-shimmer" />
                  <div className="mt-auto h-12 bg-gray-100 rounded-sm w-full skeleton-shimmer" />
                </div>
              </div>
            ))}

        {!isLoading && error && products.length === 0 && (
          <ErrorState message={error} onRetry={loadProducts} />
        )}

        {!isLoading && !error && !hasInitialData && products.length === 0 && (
          <ErrorState
            message="لم يتم تحميل المنتجات. يرجى المحاولة مرة أخرى."
            onRetry={loadProducts}
          />
        )}

        {!isLoading &&
          hasInitialData &&
          filtered.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="لا توجد منتجات"
            description={
              query || activeCategory
                ? 'لم نعثر على منتجات تطابق بحثك. جرّب كلمات مختلفة أو اختر فئة أخرى.'
                : 'لم يتم العثور على منتجات في الكatalog حالياً. يرجى المحاولة لاحقاً.'
            }
            action={
              (query || activeCategory) && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveCategory(null);
                  }}
                  className="px-6 py-2.5 border border-orange-accent text-orange-accent font-bold text-sm hover:bg-orange-accent hover:text-white transition-colors"
                >
                  مسح الفلاتر
                </button>
              )
            }
          />
        )}

        {!isLoading &&
          filtered.map((prod, index) => (
            <ProductItem key={prod.id} prod={prod} index={index} />
          ))}
      </div>
    </>
  );
}
