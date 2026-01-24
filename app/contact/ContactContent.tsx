import ContactForm from './ContactForm';
import { FadeInSection } from '../../components/FadeInSection';
import Image from 'next/image';

export default function ContactContent() {
  return (
    <div className="flex flex-col">
      <section
        className="relative h-screen flex items-end text-white"
        style={{
          backgroundImage: "url('/img/lake_reflection_2500.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
        <div className="relative w-full max-w-[1400px] mx-auto p-8">
          <h1 className="font-headline text-4xl md:text-6xl text-right">Contact</h1>
        </div>
      </section>

      <section className="bg-default-grey text-white px-4 md:px-8 pt-24 md:pt-32 pb-24 md:pb-32">
        <FadeInSection className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Column 1: Image (Left) */}
          <div className="md:col-span-3 lg:col-span-3 order-1">
            <div className="relative aspect-[1500/2612] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
              <Image
                src="/img/grey-suit-blue-shirt-2.webp"
                alt="Michael Zick"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            </div>
          </div>

          {/* Column 2: Contact Form (Middle) */}
          <div className="md:col-span-6 lg:col-span-5 bg-white text-black rounded-xl p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 order-2">
            <h2 className="text-3xl font-bold mb-8 text-default-grey">Send Me a Message</h2>
            <ContactForm />
          </div>

          {/* Column 3: CTA & Social (Right) */}
          <div className="md:col-span-3 lg:col-span-4 flex flex-col justify-start gap-12 order-3">
            <div className="flex flex-col items-start gap-8">
              <p className="text-xl lg:text-2xl font-light leading-relaxed">
                The best way to connect with Michael is to schedule a free 45-minute session,
                where we&apos;ll discuss what&apos;s preventing you from achieving the life you want.
              </p>
              <a
                href="https://calendly.com/michaelzick/45min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn !w-full text-lg lg:text-xl text-center !px-6"
              >
                Schedule Your Free Session
              </a>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="w-full h-px bg-white/20 mb-4 md:hidden" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Social</h2>
              <div className="flex flex-row gap-4">
                <a
                  href="https://michaelzick.medium.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Medium"
                  className="group inline-flex h-14 w-14 items-center justify-center rounded-lg border border-white/40 transition-all duration-300 hover:bg-white/10 hover:border-white"
                >
                  <svg
                    className="w-10 h-10 fill-current opacity-80 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                  >
                    <path d="M46.908,23.95c-0.006-0.005-0.011-0.01-0.018-0.014l-0.01-0.005l-9.05-4.525c-0.061-0.031-0.125-0.051-0.19-0.068c-0.082-0.021-0.165-0.034-0.249-0.034c-0.347,0-0.692,0.174-0.878,0.477l-5.21,8.467l6.538,10.625l9.095-14.779C46.966,24.046,46.952,23.985,46.908,23.95z M28.433,35.958L37,40.241L28.433,26.32V35.958z M38.287,40.884l7.052,3.526C46.256,44.869,47,44.548,47,43.693V26.726L38.287,40.884z M26.946,23.964l-8.839-4.419c-0.16-0.08-0.312-0.118-0.449-0.118c-0.387,0-0.659,0.299-0.659,0.802v19.083c0,0.511,0.374,1.116,0.831,1.344l7.785,3.892c0.2,0.1,0.39,0.147,0.561,0.147c0.484,0,0.823-0.374,0.823-1.003V24.051C27,24.014,26.979,23.980,26.946,23.964z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/michaelzickofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="group inline-flex h-14 w-14 items-center justify-center rounded-lg border border-white/40 transition-all duration-300 hover:bg-white/10 hover:border-white"
                >
                  <svg
                    className="w-8 h-8 fill-current opacity-80 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
