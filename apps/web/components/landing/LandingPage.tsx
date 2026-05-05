'use client';

import React from 'react';
import { T } from './tokens';
import { SiteNav }       from './SiteNav';
import { HeroSection }   from './HeroSection';
import { MarqueeBand }   from './MarqueeBand';
import { ValueSection }  from './ValueSection';
import { FlowSection }   from './FlowSection';
import { CompareSection } from './CompareSection';
import { PricingSection } from './PricingSection';
import { FAQSection }    from './FAQSection';
import { FinalCTA, LandingFooter } from './FinalCTA';

export function LandingPage() {
  return (
    <div style={{
      width: '100%', minHeight: '100%',
      background: T.bg, color: T.ink, fontFamily: T.sans,
      overflowX: 'hidden',
    }}>
      <SiteNav />
      <main>
        <HeroSection />
        <MarqueeBand />
        <ValueSection />
        <FlowSection />
        <CompareSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
