(() => {
  const root = document.documentElement;
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  // Theme
  const themePrefKey = 'theme-pref';
  const themeToggle = $('#themeToggle');
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    if (themeToggle) {
      themeToggle.querySelector('.icon').textContent = isDark ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', isDark ? '라이트 모드로' : '다크 모드로');
      themeToggle.setAttribute('title', isDark ? '라이트 모드로' : '다크 모드로');
    }
  }
  function initTheme() {
    const saved = localStorage.getItem(themePrefKey);
    if (saved) applyTheme(saved);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  }
  initTheme();
  themeToggle?.addEventListener('click', () => {
    const newTheme = root.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem(themePrefKey, newTheme);
    applyTheme(newTheme);
  });

  // Nav toggle (mobile)
  const navToggle = $('.nav-toggle');
  const navList = $('#nav-list');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList?.classList.toggle('show', !expanded);
  });
  $$('#nav-list a').forEach(a =>
    a.addEventListener('click', () => {
      if (navList?.classList.contains('show')) {
        navList.classList.remove('show');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    }),
  );

  // Reveal on scroll
  const reveals = $$('.reveal');
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  reveals.forEach(el => io.observe(el));

  // Publications filter
  const pubFilter = $('#pubFilter');
  const pubYear = $('#pubYear');
  const pubList = $('#pubList');
  function filterPubs() {
    const q = (pubFilter?.value || '').toLowerCase().trim();
    const y = pubYear?.value || '';
    $$('#pubList .pub-item', pubList).forEach(item => {
      const txt = item.textContent?.toLowerCase() || '';
      const tags = (item.getAttribute('data-tags') || '').toLowerCase();
      const year = item.getAttribute('data-year') || '';
      const matchQ = !q || txt.includes(q) || tags.includes(q);
      const matchY = !y || y === year;
      item.style.display = matchQ && matchY ? '' : 'none';
    });
  }
  pubFilter?.addEventListener('input', filterPubs);
  pubYear?.addEventListener('change', filterPubs);

  // Back to top
  const backToTop = $('#backToTop');
  function onScroll() {
    const show = window.scrollY > 300;
    backToTop?.classList.toggle('show', show);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();

  // Footer year
  const yearSpan = $('#year');
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
})();

