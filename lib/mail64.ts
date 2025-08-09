export function initMail64() {
  function d(s: string) {
    try {
      return atob(s);
    } catch (e) {
      return s;
    }
  }
  const els = document.querySelectorAll<HTMLAnchorElement>('.js-mail64');
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    const addr = d(el.getAttribute('data-addr') || '');
    if (!addr) continue;
    el.setAttribute('href', 'mailto:' + addr);
    if (!el.textContent.trim()) el.textContent = addr;
    el.setAttribute('aria-label', 'Email ' + addr);
    el.rel = 'nofollow';
  }
}
