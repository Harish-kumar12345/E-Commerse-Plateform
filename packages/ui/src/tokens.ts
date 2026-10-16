/**
 * NEXUS Marketplace Design System Tokens
 * Precise, Authoritative, High-Contrast Obsidian & Graphite Theme
 */

export const tokens = {
  colors: {
    bg: {
      base: '#090A0F', // Obsidian Base
      card: '#12151E', // Elevated Slate Panel
      cardHover: '#181C28',
      input: '#0F1219',
      border: '#1F2433',
      borderLight: '#2C3449',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      inverse: '#090A0F',
    },
    accent: {
      amber: '#F59E0B', // Primary CTA, Deals, Rating Stars
      amberHover: '#D97706',
      cyan: '#06B6D4',  // AI Finder, Prime Perks, Verified Badges
      cyanHover: '#0891B2',
      green: '#10B981', // In-stock, Success, Price Drops
      red: '#EF4444',   // Low stock, Errors, Clearance
    },
  },
  typography: {
    fonts: {
      display: 'Plus Jakarta Sans, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
    glowAmber: '0 0 20px rgba(245, 158, 11, 0.25)',
    glowCyan: '0 0 20px rgba(6, 182, 212, 0.25)',
  },
};
