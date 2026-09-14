// Progressive enhancement only: all content and navigation work without JS.
(() => {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = year;
  });

  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href')));
  const header = document.querySelector('.site-header');
  let scheduled = false;

  function updateCurrentSection() {
    scheduled = false;
    const threshold = (header?.getBoundingClientRect().height ?? 0) + 50;
    let current = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= threshold) current = index;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = links.length - 1;
    }
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateCurrentSection);
    }
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('pageshow', scheduleUpdate);
  updateCurrentSection();
})();
