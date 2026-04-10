import Script from 'next/script';

export default function SiteAnalyticsScripts() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://cdn.amplitude.com/script/46e4589d8bee602239bf1937b465e1d7.js"
      />
      <Script id="amplitude-init" strategy="afterInteractive">
        {`
          (function () {
            var start = Date.now();
            var maxWaitMs = 8000;

            function tryInit() {
              if (window.__amplitudeInitialized) return;
              if (!window.amplitude || !window.amplitude.init) {
                if (Date.now() - start < maxWaitMs) {
                  setTimeout(tryInit, 100);
                }
                return;
              }

              if (window.sessionReplay && window.sessionReplay.plugin && window.amplitude.add) {
                window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
              }

              window.amplitude.init('46e4589d8bee602239bf1937b465e1d7', {
                fetchRemoteConfig: true,
                autocapture: true,
              });
              window.__amplitudeInitialized = true;
            }

            tryInit();
          })();
        `}
      </Script>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-QK4WD4TRZV"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-QK4WD4TRZV');
        `}
      </Script>
    </>
  );
}
