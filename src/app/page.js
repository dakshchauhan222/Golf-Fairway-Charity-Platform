'use client';

import { useEffect } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import DataStrip from '@/components/sections/DataStrip';
import MechanismSection from '@/components/sections/MechanismSection';
import CharitySection from '@/components/sections/CharitySection';
import SubscriptionSection from '@/components/sections/SubscriptionSection';
import DashboardPreview from '@/components/sections/DashboardPreview';
import ClosingCTA from '@/components/sections/ClosingCTA';

export default function HomePage() {
  // Scroll reveal observer with staggered animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add staggered animation to child .reveal elements within this element
          const childReveals = entry.target.querySelectorAll('.reveal, .prize-row');
          childReveals.forEach((child, idx) => {
            if (!child.parentElement || !child.parentElement.classList.contains('reveal')) {
              child.style.transitionDelay = `${idx * 80}ms`;
              // Ensure child has initial styles
              if (!child.classList.contains('visible')) {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
              }
            }
            setTimeout(() => {
              child.classList.add('visible');
            }, 10 + idx * 80);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      
      // Also observe prize-row elements for staggered animation
      document.querySelectorAll('.prize-row').forEach((el) => {
        if (!el.classList.contains('reveal')) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)';
          observer.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <HeroSection />
      <DataStrip />
      <MechanismSection />
      <CharitySection />
      <SubscriptionSection />
      <DashboardPreview />
      <ClosingCTA />
    </>
  );
}
