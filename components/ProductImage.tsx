"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import {
  resolveProductImage,
  DEFAULT_PRODUCT_IMAGE,
} from '@/lib/product-images';

type ProductImageProps = {
  src: string;
  sku: string;
  category: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function ProductImage({
  src,
  sku,
  category,
  alt,
  className = 'object-cover',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  priority = false,
}: ProductImageProps) {
  const resolved = resolveProductImage(sku, category, src);
  const [imageSrc, setImageSrc] = useState(resolved);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-blue-primary/5">
        <Package className="text-blue-primary/40 mb-2" size={36} aria-hidden="true" />
        <span className="text-[10px] font-mono text-blue-primary/50">{sku}</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      quality={100}
      sizes={sizes}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (imageSrc !== DEFAULT_PRODUCT_IMAGE) {
          setImageSrc(DEFAULT_PRODUCT_IMAGE);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}
