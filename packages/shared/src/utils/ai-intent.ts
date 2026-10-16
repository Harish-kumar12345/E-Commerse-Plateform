/**
 * Utility for parsing natural language budget constraints in Indian denominations
 */
export function extractBudgetInPaise(query: string): number | null {
  const q = query.toLowerCase();

  // 1. Lakh match: e.g. "1.5 lakh", "1.5l", "2 lakhs", "under 1.2 lakh"
  const lakhMatch = q.match(/(?:under|below|less than|max|budget of|within)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(?:l|lac|lakh|lakhs)\b/i);
  if (lakhMatch && lakhMatch[1]) {
    const val = parseFloat(lakhMatch[1]);
    return Math.round(val * 100000 * 100);
  }

  // 2. Thousands 'k' match: e.g. "70k", "10k", "5.5k", "under 30k"
  const kMatch = q.match(/(?:under|below|less than|max|budget of|within)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch && kMatch[1]) {
    const val = parseFloat(kMatch[1]);
    return Math.round(val * 1000 * 100);
  }

  // 3. Plain numeric match: e.g. "under 50000", "below 10,000", "within 25000"
  const numMatch = q.match(/(?:under|below|less than|max|budget of|within)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
  if (numMatch && numMatch[1]) {
    const cleanNum = parseInt(numMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(cleanNum) && cleanNum > 100) {
      return cleanNum * 100;
    }
  }

  return null;
}

/**
 * Extracts intent keywords from conversational query
 */
export function extractSearchTokens(query: string): string[] {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'under', 'below', 'less', 'than',
    'a', 'an', 'in', 'of', 'to', 'is', 'best', 'good', 'my', 'i', 'need', 'want'
  ]);

  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
}
