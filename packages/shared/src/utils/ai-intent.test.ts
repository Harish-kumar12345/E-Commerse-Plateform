import { describe, it, expect } from 'vitest';
import { extractBudgetInPaise, extractSearchTokens } from './ai-intent.js';

describe('AI Intent & Natural Language Budget Parsing', () => {
  it('extracts "k" denomination budgets correctly into paise', () => {
    // "under 30k" -> 30,000 INR -> 3,000,000 paise
    expect(extractBudgetInPaise('wireless headphones under 30k')).toBe(3000000);
    // "below 8k" -> 8,000 INR -> 800,000 paise
    expect(extractBudgetInPaise('running shoes below 8k')).toBe(800000);
    // "budget of 15.5k" -> 15,500 INR -> 1,550,000 paise
    expect(extractBudgetInPaise('mechanical keyboard with budget of 15.5k')).toBe(1550000);
  });

  it('extracts "lakh" denomination budgets correctly into paise', () => {
    // "under 1.5 lakh" -> 150,000 INR -> 15,000,000 paise
    expect(extractBudgetInPaise('coding laptop under 1.5 lakh')).toBe(15000000);
    // "max 1.2L" -> 120,000 INR -> 12,000,000 paise
    expect(extractBudgetInPaise('gaming rig max 1.2l')).toBe(12000000);
  });

  it('extracts plain numeric rupee values correctly', () => {
    // "under 50000" -> 50,000 INR -> 5,000,000 paise
    expect(extractBudgetInPaise('phone under 50000')).toBe(5000000);
    // "below ₹25,000" with commas
    expect(extractBudgetInPaise('standing desk below ₹25,000')).toBe(2500000);
  });

  it('returns null when no budget constraints are specified', () => {
    expect(extractBudgetInPaise('best wireless noise canceling headphones for gym')).toBeNull();
  });

  it('filters out stop words and extracts meaningful search tokens', () => {
    const tokens = extractSearchTokens('the best headphones for gym and travel under 10k');
    expect(tokens).toContain('headphones');
    expect(tokens).toContain('gym');
    expect(tokens).toContain('travel');
    expect(tokens).toContain('10k');
    expect(tokens).not.toContain('the');
    expect(tokens).not.toContain('and');
    expect(tokens).not.toContain('for');
  });
});
