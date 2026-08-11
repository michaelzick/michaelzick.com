import Script from 'next/script';

export default function SiteAnalyticsScripts() {
  return (
    <>
      {/* Consent-gated Mixpanel bootstrap. Mixpanel loads by default (opt-out)
          for visitors outside the EU/EEA/UK, and only after opt-in for
          visitors there (timezone heuristic). The 'cookie-consent'
          key/version literals and the EU timezone check are duplicated in
          lib/cookie-consent.ts — keep them in sync.

          __loadMixpanel runs the official embed snippet: it defines a
          queueing stub at window.mixpanel synchronously, then async-loads
          the library, so init/track calls never drop — and window.mixpanel
          never exists pre-consent. The library URL is pinned to https so
          the snippet's protocol-relative default can't resolve to http on
          localhost. Regex backslashes below are doubled (\\/, \\.) because
          this lives in a template literal — single \/ would emit a corrupted
          regex into the page. */}
      <Script id="mixpanel-init" strategy="afterInteractive">
        {`
          (function () {
            var KEY = 'cookie-consent';
            var VERSION = 1;

            function readConsent() {
              var raw = null;
              try { raw = window.localStorage.getItem(KEY); } catch (e) { }
              if (!raw) {
                try {
                  var m = document.cookie.match('(?:^|; )' + KEY + '=([^;]*)');
                  if (m) raw = decodeURIComponent(m[1]);
                } catch (e) { }
              }
              if (!raw) return null;
              try {
                var parsed = JSON.parse(raw);
                return parsed && parsed.version === VERSION &&
                  typeof parsed.analytics === 'boolean' ? parsed : null;
              } catch (e) { return null; }
            }

            function isEuTimeZone() {
              try {
                var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
                return tz.indexOf('Europe/') === 0 ||
                  ['Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores',
                    'Atlantic/Reykjavik', 'Atlantic/Faroe'].indexOf(tz) !== -1;
              } catch (e) { return false; }
            }

            var loaded = false;
            window.__loadMixpanel = function () {
              if (loaded) return;
              loaded = true;

              window.MIXPANEL_CUSTOM_LIB_URL = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
              (function(e,c){if(!c.__SV){var l,h;window.mixpanel=c;c._i=[];c.init=function(q,r,f){function t(d,a){var g=a.split(".");2==g.length&&(d=d[g[0]],a=g[1]);d[a]=function(){d.push([a].concat(Array.prototype.slice.call(arguments,0)))}}var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";b.people=b.people||[];b.toString=function(d){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);d||(a+=" (stub)");return a};b.people.toString=function(){return b.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
          for(h=0;h<l.length;h++)t(b,l[h]);var n="set set_once union unset remove delete".split(" ");b.get_group=function(){function d(p){a[p]=function(){b.push([g,[p].concat(Array.prototype.slice.call(arguments,0))])}}for(var a={},g=["get_group"].concat(Array.prototype.slice.call(arguments,0)),m=0;m<n.length;m++)d(n[m]);return a};c._i.push([q,r,f])};c.__SV=1.2;var k=e.createElement("script");k.type="text/javascript";k.async=!0;k.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===
          e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=e.getElementsByTagName("script")[0];e.parentNode.insertBefore(k,e)}})(document,window.mixpanel||[]);
          window.mixpanel.init('b4c15c73e0424dde33754135a4fb4b4f', {
              debug: /^(localhost|127\\.0\\.0\\.1)$/.test(window.location.hostname),
              persistence: 'localStorage',
              autocapture: {
                pageview: 'full-url',
                click: true,
                input: true,
                scroll: true,
                submit: true,
                capture_text_content: false
              },
              record_sessions_percent: 100,
              record_heatmap_data: true,
              record_mask_all_text: false,
              record_mask_all_inputs: true
            });
            };

            // Opt-out model outside the EU/EEA/UK: Mixpanel runs by default
            // unless the visitor opted out. EU/EEA/UK visitors (timezone
            // heuristic) must opt in first.
            var stored = readConsent();
            var allowed = stored ? stored.analytics === true : !isEuTimeZone();
            if (allowed) {
              window.__loadMixpanel();
            }
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
