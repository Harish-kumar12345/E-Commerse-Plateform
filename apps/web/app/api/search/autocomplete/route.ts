import { NextResponse } from 'next/server';
import { searchCatalog, fetchDynamicCatalog } from '@/lib/catalog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const category = searchParams.get('category') || undefined;

  if (!q) {
    // Return trending searches when empty
    const trending = [
      'MacBook M3',
      'Sony WH-1000XM5',
      'iPhone 16 Pro',
      'Nike Air Force 1',
      'PlayStation 5',
      'Perfume',
      'Sneakers',
      'Smart Watch',
    ];
    return NextResponse.json({
      success: true,
      query: '',
      trending,
      suggestions: [],
      categories: [],
      products: [],
    });
  }

  // 1. Fetch dynamic catalog (DummyJSON + Master Catalog)
  const dynamicCatalog = await fetchDynamicCatalog(q);

  // 2. Search catalog
  const { items, facets } = searchCatalog(
    {
      q,
      category: category !== 'all' ? category : undefined,
      sort: 'relevance',
    },
    dynamicCatalog
  );

  // 2. Build unique keyword suggestions based on titles & keywords
  const qLower = q.toLowerCase();
  const suggestionsSet = new Set<string>();

  for (const item of items) {
    if (item.title.toLowerCase().includes(qLower)) {
      suggestionsSet.add(item.title);
    }
    for (const kw of item.keywords) {
      if (kw.toLowerCase().includes(qLower) && kw.length > 2) {
        suggestionsSet.add(kw);
      }
    }
    if (suggestionsSet.size >= 6) break;
  }

  // 3. Matched categories
  const matchedCategories = facets.categories.slice(0, 3);

  // 4. Top 4 products
  const matchedProducts = items.slice(0, 4).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    brand: p.brand,
    priceInPaise: p.priceInPaise,
    compareAtInPaise: p.compareAtInPaise,
    primaryImage: p.primaryImage,
    avgRating: p.avgRating,
    isDealOfTheDay: p.isDealOfTheDay,
  }));

  return NextResponse.json({
    success: true,
    query: q,
    suggestions: Array.from(suggestionsSet).slice(0, 5),
    categories: matchedCategories,
    products: matchedProducts,
    totalCount: items.length,
  });
}
