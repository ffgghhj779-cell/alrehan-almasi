import ProductGrid from './ProductGrid';
import { fetchProductsResult } from '@/lib/products';

export default async function ProductGridServer({ category }: { category: string | null }) {
  const { products, error } = await fetchProductsResult();

  return (
    <ProductGrid
      initialProducts={products}
      showSearch
      fetchError={error}
      initialCategory={category}
    />
  );
}
