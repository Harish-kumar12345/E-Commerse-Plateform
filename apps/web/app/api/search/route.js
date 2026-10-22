import { NextResponse } from 'next/server';
import { searchCatalog, fetchDynamicCatalog } from '@/lib/catalog';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice'), 10) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice'), 10) : undefined;
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : undefined;
  const sort = (searchParams.get('sort') ) || 'relevance';
  const dealsOnly = searchParams.get('dealsOnly') === 'true';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const primeOnly = searchParams.get('prime') === 'true';
  const minDiscount = searchParams.get('minDiscount') ? parseInt(searchParams.get('minDiscount'), 10) : undefined;

  // 1. Fetch dynamic catalog from DummyJSON + local Master Catalog
  const dynamicCatalog = await fetchDynamicCatalog(q);

  // 2. Perform faceted search & ranking
  const searchResult = searchCatalog(
    {
      q,
      category: category !== 'all' ? category : undefined,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort,
      dealsOnly,
      inStockOnly,
      primeOnly,
      minDiscount,
    },
    dynamicCatalog
  );

  return NextResponse.json({
    success: true,
    ...searchResult,
  });
}
