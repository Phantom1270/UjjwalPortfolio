// Progressive enhancement: without this script, navigation stays visible.
(() => {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  const links = document.getElementById('primary-navigation');
  if (!nav || !toggle || !links) return;
  const mobile = window.matchMedia('(max-width: 760px)');
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setOpen(open, returnFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? '−' : '+';
    links.classList.toggle('is-open', open);
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (isOpen() && !nav.contains(event.target)) setOpen(false);
  });
  nav.addEventListener('focusout', event => {
    if (isOpen() && event.relatedTarget && !nav.contains(event.relatedTarget)) setOpen(false);
  });
  links.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !mobile.matches) return;
    setOpen(false);
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const destination = document.getElementById(href.slice(1));
      if (destination) destination.focus({ preventScroll: true });
    }
  });
  function syncViewport() {
    const activeInLinks = links.contains(document.activeElement);
    const activeOnToggle = document.activeElement === toggle;
    setOpen(false);
    toggle.hidden = !mobile.matches;
    if (mobile.matches && activeInLinks) toggle.focus();
    if (!mobile.matches && activeOnToggle) links.querySelector('a').focus();
  }
  mobile.addEventListener('change', syncViewport);
  nav.classList.add('enhanced');
  syncViewport();
  const header = nav.closest('.site-header');
  if (header) {
    header.classList.add('navigation-ready');
    const updateAnchorOffset = () => {
      document.documentElement.style.setProperty('--header-offset', `${header.getBoundingClientRect().height + 16}px`);
    };
    updateAnchorOffset();
    if ('ResizeObserver' in window) new ResizeObserver(updateAnchorOffset).observe(header);
    else window.addEventListener('resize', updateAnchorOffset);
  }
})();
