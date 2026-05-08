'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import NguCouponSignupForm from './NguCouponSignupForm';

const NGU_PROMO_SEEN_KEY = 'nguPromoSeen';
const NGU_PROMO_DELAY_MS = 8000;

export default function NguPromo() {
  const [modalOpen, setModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const markSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(NGU_PROMO_SEEN_KEY, 'true');
    } catch {
      // Ignore unavailable storage; the modal should still function.
    }
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    markSeen();
    setModalOpen(false);
  }, [markSeen]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      if (window.sessionStorage.getItem(NGU_PROMO_SEEN_KEY) === 'true') {
        return undefined;
      }
    } catch {
      // If storage is unavailable, fall back to showing the promo once this mount.
    }

    timeoutId = setTimeout(() => {
      openModal();
    }, NGU_PROMO_DELAY_MS);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [openModal]);

  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal, modalOpen]);

  return (
    <>
      <aside
        aria-label="Nice Guy University promotion"
        className="fixed left-0 top-0 z-[60] flex h-16 w-full items-center bg-dark-blue px-3 text-white shadow-md min-[930px]:h-11 min-[930px]:px-6"
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center gap-2 text-sm font-semibold min-[930px]:gap-3 min-[930px]:text-base">
          <span className="min-w-0 leading-snug">
            Get 10% off courses at the new Nice Guy University!
          </span>
          <button
            type="button"
            className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-md bg-[rgb(76_95_120)] px-3 py-1.5 text-xs font-bold leading-none text-white shadow-sm transition hover:bg-[rgb(88_110_139)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue min-[930px]:min-h-7 min-[930px]:px-4 min-[930px]:text-sm"
            onClick={openModal}
          >
            Send me the coupon
          </button>
        </div>
      </aside>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ngu-promo-title"
            className="max-h-[calc(100vh-4rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 text-default-grey shadow-2xl ring-1 ring-black/10 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cta-amber">
                  Nice Guy University
                </p>
                <h2 id="ngu-promo-title" className="text-3xl font-semibold leading-tight text-default-grey">
                  Get 10% off your first course.
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close Nice Guy University signup"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-default-grey transition hover:bg-default-grey/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta-amber/60"
                onClick={closeModal}
              >
                <Cross2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <NguCouponSignupForm
              formClassName="mt-8 space-y-5"
              successClassName="mt-6 flex flex-col items-center text-center"
              successCtaLocation="ngu-promo-modal"
              onSuccess={markSeen}
            />
          </div>
        </div>
      )}
    </>
  );
}
