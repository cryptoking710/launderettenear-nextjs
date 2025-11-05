import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ResponsiveAd } from '@/components/adsense';
import {
  washingSymbols,
  dryingSymbols,
  ironingSymbols,
  bleachingSymbols,
  dryCleaningSymbols,
  type LaundrySymbol
} from '@/lib/laundry-symbols';

export const metadata: Metadata = {
  title: 'UK Laundry Care Symbols Guide: What Washing Labels Mean | LaunderetteNear.me',
  description: 'Complete visual guide to UK laundry care symbols. Learn what every washing, drying, ironing, bleaching and dry cleaning label symbol means with clear images and explanations.',
  openGraph: {
    title: 'UK Laundry Care Symbols Guide: What Washing Labels Mean | LaunderetteNear.me',
    description: 'Complete visual guide to UK laundry care symbols. Learn what every washing, drying, ironing, bleaching and dry cleaning label symbol means.',
    url: 'https://launderettenear.me/laundry-symbols',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Laundry Care Symbols Guide: What Washing Labels Mean | LaunderetteNear.me',
    description: 'Complete visual guide to UK laundry care symbols. Learn what every washing, drying, ironing, bleaching and dry cleaning label symbol means.',
  },
};

function SymbolCard({ symbol }: { symbol: LaundrySymbol }) {
  return (
    <Card className="flex flex-col items-center text-center p-4" data-testid={`symbol-${symbol.id}`}>
      <div className="w-24 h-24 flex items-center justify-center mb-3 bg-background rounded-lg">
        <Image
          src={symbol.image}
          alt={symbol.name}
          width={96}
          height={96}
          className="max-w-full max-h-full object-contain"
          data-testid={`img-symbol-${symbol.id}`}
        />
      </div>
      <h3 className="font-semibold text-sm mb-2" data-testid={`text-name-${symbol.id}`}>{symbol.name}</h3>
      <p className="text-xs text-muted-foreground" data-testid={`text-desc-${symbol.id}`}>{symbol.description}</p>
    </Card>
  );
}

export default function LaundrySymbolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb-nav">
          <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-home">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground" data-testid="text-breadcrumb-current">Laundry Symbols Guide</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" data-testid="heading-main">
            UK Laundry Care Symbols: Complete Visual Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl" data-testid="text-intro">
            Ever wondered what those mysterious symbols on your clothing labels mean? This comprehensive guide explains all UK laundry care symbols using the international ISO 3758 standard. Learn how to properly wash, dry, iron, bleach, and professionally clean your garments to keep them looking their best.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8" data-testid="info-box">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2" data-testid="heading-basics">Understanding the Basics</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1" data-testid="list-basics">
                <li data-testid="list-item-x-symbol"><strong>X through any symbol</strong> means "DO NOT" perform that action</li>
                <li data-testid="list-item-dots"><strong>Dots indicate temperature:</strong> More dots = higher heat (washing, drying, ironing)</li>
                <li data-testid="list-item-lines"><strong>Lines underneath symbols:</strong> More lines = gentler cycle needed</li>
                <li data-testid="list-item-iso"><strong>UK uses ISO 3758 standard:</strong> Same symbols as Europe and most of the world</li>
              </ul>
            </div>
          </div>
        </div>

        <ResponsiveAd slot="2411734474" />

        <section className="mb-12" data-testid="section-washing">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3" data-testid="heading-washing">Washing Symbols</h2>
            <p className="text-muted-foreground" data-testid="text-washing-desc">
              The washtub icon indicates machine or hand washing. The number inside shows the maximum temperature in Celsius. Lines underneath indicate the wash cycle type - more lines mean gentler treatment.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {washingSymbols.map(symbol => (
              <SymbolCard key={symbol.id} symbol={symbol} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <ResponsiveAd slot="5991886839" />

        <section className="mb-12" data-testid="section-drying">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3" data-testid="heading-drying">Drying Symbols</h2>
            <p className="text-muted-foreground" data-testid="text-drying-desc">
              The square icon represents drying methods. A circle inside indicates tumble drying (dots show heat level), while different line patterns show air-drying methods like hanging, drip drying, or laying flat.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {dryingSymbols.map(symbol => (
              <SymbolCard key={symbol.id} symbol={symbol} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-12" data-testid="section-ironing">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3" data-testid="heading-ironing">Ironing Symbols</h2>
            <p className="text-muted-foreground" data-testid="text-ironing-desc">
              The iron icon shows whether ironing is allowed and at what temperature. One dot = cool (110°C), two dots = warm (150°C), three dots = hot (200°C). Some garments require no steam.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ironingSymbols.map(symbol => (
              <SymbolCard key={symbol.id} symbol={symbol} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <ResponsiveAd slot="1240578443" />

        <section className="mb-12" data-testid="section-bleaching">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3" data-testid="heading-bleaching">Bleaching Symbols</h2>
            <p className="text-muted-foreground" data-testid="text-bleaching-desc">
              The triangle icon indicates whether bleaching is permitted. An empty triangle allows any bleach, diagonal lines mean non-chlorine bleach only, and an X means no bleaching allowed.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bleachingSymbols.map(symbol => (
              <SymbolCard key={symbol.id} symbol={symbol} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-12" data-testid="section-dry-cleaning">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3" data-testid="heading-dry-cleaning">Professional Dry Cleaning Symbols</h2>
            <p className="text-muted-foreground" data-testid="text-dry-cleaning-desc">
              The circle icon relates to professional cleaning services. Letters inside (P, F, W) indicate which cleaning solvents are safe to use - these codes are primarily for dry cleaners, not consumers.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {dryCleaningSymbols.map(symbol => (
              <SymbolCard key={symbol.id} symbol={symbol} />
            ))}
          </div>
        </section>

        <ResponsiveAd slot="3365723499" />

        <Card className="mb-8" data-testid="tips-card">
          <CardHeader>
            <CardTitle data-testid="title-tips">Top Tips for Following Care Labels</CardTitle>
            <CardDescription data-testid="desc-tips">Make your clothes last longer by following these best practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div data-testid="tip-check-before-washing">
              <h4 className="font-semibold mb-1" data-testid="heading-tip-1">Always Check Before Washing</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-tip-1">New garments may have care requirements you're not expecting. Check labels before the first wash.</p>
            </div>
            <div data-testid="tip-go-gentle">
              <h4 className="font-semibold mb-1" data-testid="heading-tip-2">When in Doubt, Go Gentle</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-tip-2">If you're unsure, use cooler water, lower heat, and gentler cycles. It's better to be cautious.</p>
            </div>
            <div data-testid="tip-sort-symbols">
              <h4 className="font-semibold mb-1" data-testid="heading-tip-3">Sort by Symbol Requirements</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-tip-3">Group clothes with similar care needs rather than just by colour to optimize your wash loads.</p>
            </div>
            <div data-testid="tip-save-energy">
              <h4 className="font-semibold mb-1" data-testid="heading-tip-4">Save Energy with Lower Temperatures</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-tip-4">Modern detergents work well at 30°C. Washing at lower temperatures saves energy and is gentler on fabrics.</p>
            </div>
            <div data-testid="tip-professional-help">
              <h4 className="font-semibold mb-1" data-testid="heading-tip-5">Professional Help for Complex Items</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-tip-5">For delicate, valuable, or dry-clean-only items, visit a professional <Link href="/" className="text-primary hover:underline" data-testid="link-launderettes">launderette</Link> or dry cleaner.</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted rounded-lg p-6 text-center" data-testid="cta-section">
          <h3 className="text-xl font-bold mb-2" data-testid="heading-cta">Need Professional Laundry Services?</h3>
          <p className="text-muted-foreground mb-4" data-testid="text-cta-desc">
            Find your nearest launderette for expert care of delicate items, large loads, or dry cleaning services.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2 font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-find-launderettes"
          >
            Find Launderettes Near You
          </Link>
        </div>
      </div>
    </div>
  );
}
