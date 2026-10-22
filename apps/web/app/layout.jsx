
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AiAssistant } from '../components/AiAssistant';

export const metadata = {
  metadataBase: new URL('https://nexusmarket.in'),
  title: {
    default: 'NEXUS Bazaar — Multi-Vendor Marketplace',
    template: '%s | NEXUS Bazaar',
  },
  description:
    'Precision multi-vendor e-commerce marketplace powered by AI natural language discovery, 360° Studio, verified sellers, and split-order fulfillment across India.',
  keywords: [
    'marketplace',
    'e-commerce india',
    'ai product finder',
    'verified sellers',
    'electronics',
    'audio headphones',
    'macbook',
    'fashion',
    'deals of the day',
    'express delivery',
    'nexus prime',
  ],
  authors: [{ name: 'NEXUS Commerce Engineering' }],
  creator: 'NEXUS',
  publisher: 'NEXUS Marketplace India',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'NEXUS Bazaar — Multi-Vendor Precision Commerce',
    description:
      'Discover 50,000+ curated products from verified Indian merchants with conversational AI intent search and transparent price-drop vaults.',
    url: 'https://nexusmarket.in',
    siteName: 'NEXUS Bazaar',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS Bazaar — Multi-Vendor Precision Commerce',
    description: 'Conversational AI discovery, multi-seller split checkout, and 360° interactive product studio.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}

) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090A0F] text-[#F8FAFC] antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AiAssistant />
      </body>
    </html>
  );
}
