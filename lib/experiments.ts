export type TestimonialsMobileLayoutMode = 'experiment' | 'inline' | 'carousel';

const VALID_TESTIMONIALS_MOBILE_LAYOUT_MODES: TestimonialsMobileLayoutMode[] = [
  'experiment',
  'inline',
  'carousel',
];

function normalizeTestimonialsMobileLayoutMode(
  value: string | undefined,
): TestimonialsMobileLayoutMode {
  if (!value) return 'experiment';
  return VALID_TESTIMONIALS_MOBILE_LAYOUT_MODES.includes(value as TestimonialsMobileLayoutMode)
    ? (value as TestimonialsMobileLayoutMode)
    : 'experiment';
}

export const TESTIMONIALS_MOBILE_LAYOUT_MODE = normalizeTestimonialsMobileLayoutMode(
  process.env.NEXT_PUBLIC_TESTIMONIALS_MOBILE_LAYOUT_MODE,
);

export const AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY =
  process.env.NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY;

export const TESTIMONIALS_MOBILE_EXPERIMENT_FLAG_KEY =
  process.env.NEXT_PUBLIC_TESTIMONIALS_MOBILE_EXPERIMENT_FLAG_KEY || 'testimonials_mobile_layout';
