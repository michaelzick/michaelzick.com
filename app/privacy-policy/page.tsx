import type { Metadata } from 'next';
import Link from 'next/link';
import OpenCookiePreferencesButton from '../../components/OpenCookiePreferencesButton';
import { siteConfig } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | Michael Zick Coaching',
  description: 'How michaelzick.com collects, uses, and protects your information, including analytics cookies, session replay, and your choices.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Michael Zick Coaching',
    description: 'How michaelzick.com collects, uses, and protects your information, including analytics cookies, session replay, and your choices.',
    url: `${siteConfig.url}/privacy-policy`,
    siteName: siteConfig.name,
    type: 'website',
    locale: siteConfig.locale,
  },
};

const sectionHeading = 'font-headline text-3xl font-semibold leading-tight';
const subHeading = 'text-xl font-semibold';
const body = 'text-lg';
const list = 'list-disc pl-6 space-y-2 text-lg';
const inlineLink = 'underline underline-offset-4 transition hover:text-primary-blue';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col">
      <section className="page-top-offset px-6 pb-24 md:px-8 md:pb-32 bg-light-grey text-default-grey">
        <div className="mx-auto max-w-[900px] space-y-12">
          <div className="space-y-6">
            <h1 className="font-headline text-5xl font-semibold leading-tight md:text-6xl">
              Privacy Policy
            </h1>
            <p className="text-lg">
              <strong>Effective Date:</strong> August 11, 2026
            </p>
            <p className={body}>
              Michael Zick Coaching (&quot;we,&quot; &quot;us&quot;) respects your privacy. This
              Privacy Policy explains what information michaelzick.com collects, how it is used,
              and the choices you have. This site has no user accounts and processes no payments —
              it exists to share coaching content and let you reach out when you&apos;re ready.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Information You Share With Us</h2>
            <p className={body}>
              You can browse the entire site without providing any personal information. We collect
              personal information only when you choose to submit it:
            </p>
            <ul className={list}>
              <li>
                <strong>Contact form</strong> — your name, email address, message, and optional
                workbook/newsletter opt-in.
              </li>
              <li>
                <strong>Nice Guy University coupon signup</strong> — your email address, used to
                send the coupon.
              </li>
              <li>
                <strong>Questionnaire</strong> — your answers and email address, used to generate
                and deliver your coaching analysis.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>How We Use Your Information</h2>
            <ul className={list}>
              <li>Respond to your messages and coaching inquiries.</li>
              <li>Email you the Nice Guy University coupon you requested.</li>
              <li>
                Generate your questionnaire analysis. Your answers are processed by OpenAI&apos;s
                API to produce the written analysis; they are not used to train OpenAI&apos;s
                models under our API terms.
              </li>
              <li>
                Add you to the newsletter list (in our HubSpot CRM) only when you explicitly opt
                in on the contact form.
              </li>
              <li>Send transactional email through Brevo, our email delivery provider.</li>
            </ul>
            <p className={body}>
              <strong>We never sell your personal information</strong>, and we never share it with
              third parties for their marketing purposes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Analytics, Cookies, and Session Replay</h2>
            <h3 className={subHeading}>Essential Storage (Always On)</h3>
            <p className={body}>
              We store your cookie consent choice (<code>cookie-consent</code>) and small
              site-function flags, such as whether you&apos;ve dismissed a promotion this session.
              These are required for the site to work and respect your choices.
            </p>
            <h3 className={subHeading}>Analytics</h3>
            <ul className={list}>
              <li>
                <strong>Google Analytics 4</strong> — high-level traffic and acquisition
                measurement. Sets cookies such as <code>_ga</code> and <code>_ga_*</code>.
              </li>
              <li>
                <strong>Mixpanel</strong> — product analytics, session replay, and heatmaps, used
                only by us to improve the site. Session replay captures page interactions with all
                form inputs masked; anything you type into a form is never recorded in a replay.
                Stores identifiers such as <code>mp_*</code> in cookies and browser local storage.
              </li>
            </ul>
            <p className={body}>
              Mixpanel is governed by our cookie consent banner: it runs by default for visitors
              outside the EU/EEA/UK and you can opt out anytime, while visitors in those regions
              (detected by device timezone) are asked to opt in before it loads. Opting out stops
              Mixpanel collection and removes its cookies and local storage on a best-effort
              basis. You can change your choice anytime with the Cookie Preferences link in the
              footer, or by{' '}
              <OpenCookiePreferencesButton className={inlineLink}>
                opening Cookie Preferences right here
              </OpenCookiePreferencesButton>
              .
            </p>
            <h3 className={subHeading}>Spam Protection</h3>
            <p className={body}>
              Our forms are protected by Google&apos;s Invisible reCAPTCHA, which is subject to
              Google&apos;s privacy policy and terms of service.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Third-Party Services</h2>
            <p className={body}>
              We share data with service providers only as needed to operate the site: OpenAI
              (questionnaire analysis), Brevo (email delivery), HubSpot (newsletter contacts,
              opt-in only), Google (analytics and reCAPTCHA), and Mixpanel (analytics). Booking a
              session takes you to Calendly, and Nice Guy University courses live on their own
              platform — each has its own privacy policy that applies once you&apos;re there.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Data Security and Retention</h2>
            <p className={body}>
              Form submissions are transmitted over encrypted connections and delivered by email;
              we keep correspondence only as long as needed to work with you. We do not store
              credit card numbers or financial information — this site processes no payments.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Your Rights</h2>
            <p className={body}>
              You may request access to, correction of, or deletion of the personal information
              you&apos;ve sent us at any time by reaching out through the{' '}
              <Link href="/contact" className={inlineLink}>contact page</Link>. If you are in the
              EU/EEA/UK, you also have GDPR rights to access, rectify, erase, and port your data,
              and to withdraw consent as easily as you gave it — via the Cookie Preferences link in
              the footer. California residents (and residents of states with similar laws) have
              the right to know, delete, and correct; because we do not sell or share personal
              information, there is nothing to opt out of under those laws.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Children&apos;s Privacy</h2>
            <p className={body}>
              This site offers coaching for adults and is not directed to children under 18. We do
              not knowingly collect personal information from children.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Changes to This Policy</h2>
            <p className={body}>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated effective date.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className={sectionHeading}>Contact</h2>
            <p className={body}>
              Questions about this policy or your data? Reach out through the{' '}
              <Link href="/contact" className={inlineLink}>contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
