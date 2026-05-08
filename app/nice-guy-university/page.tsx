import type { Metadata } from 'next';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { FadeInSection } from '../../components/FadeInSection';
import NguCouponSignupForm from '../../components/NguCouponSignupForm';
import TrackedCtaLink from '../../components/TrackedCtaLink';
import { siteConfig } from '../../lib/site';

const NGU_URL = 'https://www.niceguyuniversity.com';

export const metadata: Metadata = {
  title: 'Nice Guy University | Online Nice Guy Recovery Courses',
  description:
    'Explore Nice Guy University, Michael Zick\'s online course platform for approval addiction, boundaries, dating confidence, conflict, and Nice Guy recovery.',
  alternates: {
    canonical: '/nice-guy-university',
  },
  openGraph: {
    title: 'Nice Guy University | Online Nice Guy Recovery Courses',
    description:
      'Self-paced courses, applied exercises, and coach-led frameworks for men ready to stop performing for approval.',
    url: `${siteConfig.url}/nice-guy-university`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/img/homepage_mountains.webp',
        alt: 'Mountain landscape at sunset',
      },
    ],
    type: 'website',
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nice Guy University | Online Nice Guy Recovery Courses',
    description:
      'Self-paced courses, applied exercises, and coach-led frameworks for men ready to stop performing for approval.',
    images: ['/img/homepage_mountains.webp'],
  },
};

const platformHighlights = [
  {
    title: 'Self-paced lessons',
    description:
      'Move through structured course material on your schedule, then return to the lessons when the pattern shows up again.',
  },
  {
    title: 'Applied exercises',
    description:
      'Journal prompts and practical field work turn insight into new behavior, not another round of passive consumption.',
  },
  {
    title: 'Coach-led frameworks',
    description:
      'The course library is built around the same recovery work Michael teaches in coaching: truth, standards, boundaries, and internal authority.',
  },
  {
    title: 'Secure enrollment',
    description:
      'Nice Guy University handles learner accounts, enrollments, and Stripe-powered checkout so you can start cleanly.',
  },
];

const courseTracks = [
  {
    title: 'Introduction To Nice Guy Recovery',
    meta: 'Foundation course',
    description:
      'Identify the approval-seeking operating system, trace where it came from, and start rebuilding around authenticity and self-respect.',
  },
  {
    title: 'Breaking Self-Limiting Beliefs with Women',
    meta: 'Dating confidence',
    description:
      'Expose the fear-based scripts and negative predictors that quietly run your love life before real life gets a vote.',
  },
  {
    title: 'How To Understand Women And Handle Conflict',
    meta: 'Communication and conflict',
    description:
      'Decode emotional subcommunication, stay grounded under pressure, and learn conflict repair without collapsing into appeasement.',
  },
  {
    title: 'The Cognitive Distortion Playbook',
    meta: 'Mental fitness',
    description:
      'Learn the thinking errors behind approval seeking, resentment, boundary collapse, and chronic self-doubt, then practice clearer thinking.',
  },
];

const frameworkSteps = [
  {
    title: 'Confront toxic shame',
    description:
      'Stop organizing your life around being acceptable and start telling the truth about what you want, avoid, and resent.',
  },
  {
    title: 'Release victim identity',
    description:
      'Shift from waiting for people to change first into owning the decisions, standards, and tolerances shaping your life.',
  },
  {
    title: 'Build masculine boundaries',
    description:
      'Set limits that protect your time, energy, and relationships without disappearing, exploding, or bargaining for approval.',
  },
];

function NguExternalCta({
  children,
  location,
  className = 'btn cta-unified',
}: {
  children: ReactNode;
  location: string;
  className?: string;
}) {
  return (
    <TrackedCtaLink
      href={NGU_URL}
      location={location}
      label={typeof children === 'string' ? children : 'Visit Nice Guy University'}
      eventName="ngu_visit_click"
      className={className}
    >
      {children}
    </TrackedCtaLink>
  );
}

export default function NiceGuyUniversityPage() {
  return (
    <div className="flex flex-col" data-testid="ngu-landing-page">
      <section className="relative overflow-hidden bg-dark-blue px-6 pb-10 pt-36 text-white md:px-8 md:pb-14 min-[1440px]:pt-40">
        <Image
          src="/img/homepage_mountains.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-dark-blue/80" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1400px]">
          <FadeInSection className="max-w-4xl space-y-7" immediate>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cta-amber">
              Online Nice Guy Recovery Courses
            </p>
            <h1 className="font-headline text-5xl font-bold leading-tight text-white md:text-7xl">
              Nice Guy University
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-white/85 md:text-2xl">
              A self-paced course platform for men ready to break approval addiction,
              end covert contracts, build boundaries, and date from standards instead of scarcity.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <NguExternalCta location="ngu-hero">Browse NGU Courses</NguExternalCta>
              <TrackedCtaLink
                href="#ngu-coupon"
                location="ngu-hero"
                label="Get the 10% Coupon"
                eventName="ngu_coupon_anchor_click"
                className="btn-secondary cta-unified border-white text-white hover:bg-white/10 focus-visible:ring-white/60"
                target="_self"
              >
                Get the 10% Coupon
              </TrackedCtaLink>
            </div>
            <p className="text-sm font-medium text-white/65">
              Built by Michael Zick, Certified Nice Guy Recovery Coach trained by Dr. Robert Glover.
            </p>
          </FadeInSection>
        </div>
      </section>

      <section className="bg-light-grey px-6 py-16 text-default-grey md:px-8 md:py-20">
        <div className="mx-auto max-w-[1400px]">
          <FadeInSection className="mb-12 max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cta-amber">
              Why NGU
            </p>
            <h2 className="font-headline text-4xl font-semibold leading-tight md:text-6xl">
              Structured recovery work you can start now.
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-default-grey/75">
              Nice Guy University exists for the gap between knowing the pattern and changing it.
              The platform turns Michael&apos;s coaching frameworks into courses you can revisit,
              practice, and apply in real relationships.
            </p>
          </FadeInSection>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {platformHighlights.map((item) => (
              <FadeInSection
                key={item.title}
                className="rounded-lg border border-default-grey/15 bg-white p-5 shadow-sm md:p-6"
              >
                <h3 className="text-2xl font-semibold leading-tight">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-default-grey/75">{item.description}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-blue px-6 py-16 text-white md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <FadeInSection className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cta-amber">
              Course Library
            </p>
            <h2 className="font-headline text-4xl font-semibold leading-tight md:text-6xl">
              Start where the pattern is loudest.
            </h2>
            <p className="text-xl leading-relaxed text-white/75">
              The NGU course catalog covers the recurring Nice Guy loops: approval addiction,
              self-limiting beliefs with women, conflict avoidance, cognitive distortions,
              weak boundaries, and relationship frame.
            </p>
            <NguExternalCta location="ngu-course-library" className="btn cta-unified">
              See the Course Catalog
            </NguExternalCta>
          </FadeInSection>

          <div className="grid gap-5 md:grid-cols-2">
            {courseTracks.map((course) => (
              <FadeInSection
                key={course.title}
                className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-sm md:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                  {course.meta}
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">{course.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-white/75">{course.description}</p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 text-default-grey md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
          <FadeInSection>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md">
              <Image
                src="/img/grey-suit-blue-shirt.webp"
                alt="Michael Zick in a grey suit and blue shirt"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </FadeInSection>
          <FadeInSection className="space-y-8">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cta-amber">
                Core Framework
              </p>
              <h2 className="font-headline text-4xl font-semibold leading-tight md:text-6xl">
                The same three pillars keep coming back.
              </h2>
            </div>
            <ul className="list-none border-t border-default-grey/25 p-0">
              {frameworkSteps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-6 border-b border-default-grey/15 py-7">
                  <span className="mt-2 font-mono text-xs font-semibold tracking-[0.35em] text-default-grey/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold leading-snug md:text-3xl">{step.title}</h3>
                    <p className="mt-2 text-lg leading-relaxed text-default-grey/75">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeInSection>
        </div>
      </section>

      <section
        id="ngu-coupon"
        aria-label="Nice Guy University email coupon"
        className="bg-light-grey px-6 py-16 text-default-grey md:px-8 md:py-20"
      >
        <div className="mx-auto grid max-w-[1200px] gap-10 rounded-lg bg-white p-6 shadow-md md:grid-cols-[0.95fr_1.05fr] md:p-8 lg:p-10">
          <FadeInSection className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cta-amber">
              Email Signup
            </p>
            <h2 className="font-headline text-4xl font-semibold leading-tight md:text-5xl">
              Get 10% off your first NGU course.
            </h2>
            <p className="text-lg leading-relaxed text-default-grey/75">
              Join Michael&apos;s email list and I&apos;ll send the Nice Guy University coupon
              directly to your inbox. Use it when you are ready to enroll.
            </p>
            <p className="text-base font-semibold text-default-grey">
              The coupon is delivered by email, just like the sitewide NGU offer.
            </p>
          </FadeInSection>
          <FadeInSection>
            <NguCouponSignupForm
              successCtaLocation="ngu-landing-coupon"
              intro={(
                <p className="text-base leading-relaxed text-default-grey/75">
                  Enter your email to get the 10% off coupon and receive updates about Nice Guy University courses.
                </p>
              )}
            />
          </FadeInSection>
        </div>
      </section>

      <section className="bg-default-grey px-6 py-16 text-white md:px-8 md:py-20">
        <div className="mx-auto max-w-[1200px] text-center">
          <FadeInSection className="space-y-6">
            <h2 className="font-headline text-4xl font-semibold leading-tight md:text-6xl">
              Do the work where it is organized.
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/75">
              Browse the NGU catalog, pick the course that matches the loop you are ready to break,
              and start building a life that is not run by approval.
            </p>
            <div className="flex justify-center">
              <NguExternalCta location="ngu-bottom">Visit Nice Guy University</NguExternalCta>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
