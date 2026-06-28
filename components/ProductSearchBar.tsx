"use client";

import { Search, X } from 'lucide-react';

type ProductSearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  resultCount: number;
};

export default function ProductSearchBar({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
}: ProductSearchBarProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="relative max-w-xl">
        <label htmlFor="product-search" className="sr-only">
          البحث في المنتجات
        </label>
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-primary pointer-events-none"
          size={20}
          aria-hidden="true"
        />
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="ابحث بالاسم أو رمز SKU..."
          className="w-full py-3.5 pr-12 pl-10 bg-white border border-blue-primary/15 font-tajawal text-text-dark placeholder:text-gray-400 focus:outline-none focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 transition-all luxury-shadow min-h-[44px]"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-accent transition-colors touch-target touch-press active:scale-95"
            aria-label="مسح البحث"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap snap-x snap-mandatory"
        role="group"
        aria-label="تصفية حسب الفئة"
      >
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 snap-start px-4 py-2.5 text-sm font-bold transition-all touch-press active:scale-95 min-h-[44px] ${
            activeCategory === null
              ? 'bg-blue-primary text-white luxury-shadow'
              : 'bg-white text-blue-deep border border-blue-primary/20 hover:border-orange-accent'
          }`}
          aria-pressed={activeCategory === null}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat === activeCategory ? null : cat)}
            className={`shrink-0 snap-start px-4 py-2.5 text-sm font-bold transition-all touch-press active:scale-95 min-h-[44px] ${
              activeCategory === cat
                ? 'bg-orange-accent text-white luxury-shadow'
                : 'bg-white text-blue-deep border border-blue-primary/20 hover:border-orange-accent'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 font-tajawal" aria-live="polite">
        {resultCount} منتج{resultCount !== 1 ? '' : ''} متاح
      </p>
    </div>
  );
}
