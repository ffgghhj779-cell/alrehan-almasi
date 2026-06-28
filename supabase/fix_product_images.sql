-- =============================================================================
-- Fix broken product image URLs (invalid Unsplash IDs → verified photos)
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================================================

BEGIN;

UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-SAL-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=640&q=85&auto=format&fit=crop&crop=center' WHERE sku = 'ARA-FSH-002';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&h=640&q=85&auto=format&fit=crop&crop=top' WHERE sku = 'ARA-FSH-003';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-SHR-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-CHK-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-CHK-002';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=900&h=640&q=85&auto=format&fit=crop&crop=edges' WHERE sku = 'ARA-CHK-003';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-RIC-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&h=640&q=85&auto=format&fit=crop&crop=top' WHERE sku = 'ARA-RIC-002';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&h=640&q=85&auto=format&fit=crop&crop=bottom' WHERE sku = 'ARA-RIC-003';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-OLV-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&h=640&q=85&auto=format&fit=crop&crop=center' WHERE sku = 'ARA-OIL-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&h=640&q=85&auto=format&fit=crop&crop=edges' WHERE sku = 'ARA-OIL-002';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-OIL-003';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-FRZ-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-FRZ-002';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-FRZ-003';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&h=640&q=85&auto=format&fit=crop&crop=edges' WHERE sku = 'ARA-FRZ-004';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-MET-001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=900&h=640&q=85&auto=format&fit=crop&crop=entropy' WHERE sku = 'ARA-DAI-001';

COMMIT;
