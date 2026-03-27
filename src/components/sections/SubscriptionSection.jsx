'use client';

import Link from 'next/link';

const plans = [
  {
    label: 'Free',
    price: '€0',
    suffix: '',
    meta: 'Forever free',
    tag: 'Popular',
    icon: '🟢',
    pricingInfo: 'No credit card required',
    features: [
      'Public and private projects',
      '300K tokens/day limit',
      '1M tokens per month',
      'Bolt branding on websites',
      '10MB file upload',
      'Website hosting',
      'Up to 333k web requests',
      'Unlimited databases',
    ],
    button: 'Get Started',
    buttonClass: 'cta-outline',
  },
  {
    label: 'Pro',
    price: '€25',
    suffix: 'per month',
    meta: 'Billed monthly',
    tag: 'Best value',
    icon: '⚡',
    pricingInfo: 'Billed monthly',
    features: [
      'Public and private projects',
      'No daily token limit',
      '10M tokens/month start',
      'No branding on websites',
      '100MB file upload',
      'Website hosting',
      'Up to 1M web requests',
      'Unused tokens roll over',
      'Custom domain support',
      'SEO boosting',
      'Unlimited databases',
      'Expanded database capacity',
    ],
    button: 'Choose Pro',
    buttonClass: 'cta-solid-yellow',
  },
  {
    label: 'Teams',
    price: '€30',
    suffix: 'per month/member',
    meta: 'Billed monthly',
    tag: 'Popular',
    icon: '👥',
    pricingInfo: 'Billed monthly per team member',
    features: [
      'Everything in Pro',
      'Shared spaces & collaboration',
      'Team role management',
      'Group billing',
      'Priority support',
      'Unused token roll-over',
      'Private NPM registries support',
      'Design System knowledge with per-package prompts',
      'Granular admin controls & user provisioning',
      'Share with your organization',
      'Centralized billing',
    ],
    button: 'Choose Teams',
    buttonClass: 'cta-solid-yellow',
  },
  {
    label: 'Enterprise',
    price: 'Custom',
    suffix: '',
    meta: 'Contact us',
    tag: 'Tailored',
    icon: '🏢',
    pricingInfo: 'Custom billing & enterprise scale',
    features: [
      'Everything in Teams',
      'Dedicated account manager',
      'SLA & custom compliance',
      'Dedicated onboarding',
      'Unlimited scale',
      'Advanced security & compliance support',
      'Custom workflows, integrations & SLAs',
      'Scalable for large teams',
      'Flexible billing & procurement options',
      'Data governance & retention policies',
      'Hands-on onboarding & training',
    ],
    button: 'Contact Sales',
    buttonClass: 'cta-solid-outline',
  },
];

export default function SubscriptionSection() {
  return (
    <section className="bg-[#0C0C0C] min-h-screen flex items-center justify-center px-8 border-t border-gray-900">
      <div className="w-full max-w-[1700px] mx-auto py-12">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">04 / Plans</div>
          <h2 className="text-5xl lg:text-6xl font-serif font-semibold text-white">One platform. Two plans. Four experiences.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 items-center justify-items-center">
          {plans.map((plan) => (
            <article key={plan.label} className="relative w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/8 backdrop-blur-2xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_56px_120px_rgba(232,255,0,0.34)] flex flex-col">
              <div className="absolute top-3 right-3 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full text-black bg-yellow-400/90">{plan.tag}</div>

              <div className="text-lg font-semibold text-gray-400 mb-4">{plan.label}</div>
              <div className="flex items-start gap-2 mb-1">
                <span className="text-6xl lg:text-7xl font-serif text-white leading-none">{plan.price}</span>
                {plan.suffix && (
                  <div className="flex flex-col justify-start pt-3">
                    <span className="text-xs text-gray-300 leading-tight font-medium">{plan.suffix}</span>
                    <span className="text-xs text-gray-500 leading-tight">{plan.meta}</span>
                  </div>
                )}
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-6">{plan.pricingInfo}</div>

              <ul className="space-y-2 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#E8FF00]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full text-sm font-semibold px-4 py-3 rounded-lg ${plan.buttonClass} ${plan.buttonClass === 'cta-solid-yellow' ? 'text-black' : 'text-white'}`}
              >
                {plan.button}
              </button>

              <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute -left-6 -bottom-8 h-20 w-20 rounded-full bg-fuchsia-500/20 blur-3xl" />
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .cta-solid-yellow {
          background: #E8FF00;
          color: #0C0C0C;
        }

        .cta-outline {
          background: transparent;
          border: 2px solid #E8FF00;
          color: #F0EDE8;
        }

        .cta-solid-outline {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #F0EDE8;
        }

        .cta-solid-yellow:hover,
        .cta-outline:hover,
        .cta-solid-outline:hover {
          transform: scale(1.01);
        }

        @media (max-width: 768px) {
          .font-serif { font-family: var(--font-serif); }
        }
      `}</style>
    </section>
  );
}
