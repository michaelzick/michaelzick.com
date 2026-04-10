import { siteConfig } from './site';

export function getSchemaLocale() {
  return siteConfig.locale.replace('_', '-');
}

export function getRegionParts(region = siteConfig.region) {
  const [countryCode, regionCode] = region.split('-');
  return { countryCode, regionCode };
}

export function getOrganizationAddress() {
  const { countryCode, regionCode } = getRegionParts();

  return {
    '@type': 'PostalAddress',
    addressLocality: siteConfig.placename,
    ...(regionCode ? { addressRegion: regionCode } : {}),
    ...(countryCode ? { addressCountry: countryCode } : {}),
  };
}

export function getSiteStructuredData() {
  const organizationAddress = getOrganizationAddress();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.businessName,
        url: siteConfig.url,
        description: siteConfig.description,
        image: `${siteConfig.url}${siteConfig.personImage}`,
        address: organizationAddress,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 34.0522,
          longitude: -118.2437,
        },
        areaServed: {
          '@type': 'City',
          name: siteConfig.placename,
        },
        priceRange: '$$',
        telephone: '',
        sameAs: siteConfig.sameAs,
      },
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}/#person`,
        name: siteConfig.shortName,
        jobTitle: 'Nice Guy Recovery Coach',
        description: siteConfig.description,
        url: siteConfig.url,
        image: `${siteConfig.url}${siteConfig.personImage}`,
        address: organizationAddress,
        worksFor: {
          '@id': `${siteConfig.url}/#organization`,
        },
        sameAs: siteConfig.sameAs,
      },
      {
        '@type': 'Service',
        '@id': `${siteConfig.url}/#coaching`,
        name: 'Nice Guy Recovery Coaching',
        provider: { '@id': `${siteConfig.url}/#person` },
        areaServed: { '@type': 'City', name: siteConfig.placename },
        description:
          'Specialized coaching for men to break free from approval addiction, toxic shame, and enmeshment to reclaim internal authority.',
        serviceType: 'Life Coaching',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
        },
      },
    ],
  };
}
