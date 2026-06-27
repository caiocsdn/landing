document.addEventListener('DOMContentLoaded', () => {

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================== NAV: blur on scroll ===================== */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===================== NAV: mobile toggle ===================== */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function closeMobileNav() {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));
  }

  /* ===================== SCROLLSPY ===================== */
  const spySections = ['stack', 'servicos', 'diferenciais', 'faq', 'sobre', 'contato']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navItems = document.querySelectorAll('[data-nav]');

  if (spySections.length) {
    const spyObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navItems.forEach((a) =>
              a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id)
            );
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    spySections.forEach((s) => spyObs.observe(s));
  }

  /* ===================== REVEAL ON SCROLL ===================== */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* ===================== COPY EMAIL ===================== */
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyLabel = document.getElementById('copyEmailLabel');
  const email = 'caiocesar.contato01@gmail.com';

  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        copyLabel.textContent = 'e-mail copiado';
        setTimeout(() => (copyLabel.textContent = email), 1800);
      } catch (err) {
        window.location.href = 'mailto:' + email;
      }
    });
  }

  /* ===================== HERO DEMO: typing -> preview ===================== */
  const demo = document.getElementById('demo');
  const typedCodeEl = document.getElementById('typedCode');
  const cursorEl = document.getElementById('cursor');
  const tabCode = document.getElementById('tabCode');
  const tabPreview = document.getElementById('tabPreview');
  const panelCode = document.getElementById('panelCode');
  const panelPreview = document.getElementById('panelPreview');

  if (demo && typedCodeEl && tabCode && tabPreview && panelCode && panelPreview) {

    const plainCode =
      '<section class="hero">\n' +
      '  <h1>Sabor que <span>conquista</span></h1>\n' +
      '  <a class="cta" href="#cardapio">Ver cardápio</a>\n' +
      '</section>';

    const highlightedCode =
      '&lt;<span class="tok-tag">section</span> <span class="tok-attr">class</span>=<span class="tok-str">"hero"</span>&gt;\n' +
      '  &lt;<span class="tok-tag">h1</span>&gt;Sabor que &lt;<span class="tok-tag">span</span>&gt;conquista&lt;/<span class="tok-tag">span</span>&gt;&lt;/<span class="tok-tag">h1</span>&gt;\n' +
      '  &lt;<span class="tok-tag">a</span> <span class="tok-attr">class</span>=<span class="tok-str">"cta"</span> <span class="tok-attr">href</span>=<span class="tok-str">"#cardapio"</span>&gt;Ver cardápio&lt;/<span class="tok-tag">a</span>&gt;\n' +
      '&lt;/<span class="tok-tag">section</span>&gt;';

    let autoTimer = null;
    let userInteracted = false;

    function showCode() {
      panelCode.classList.add('is-active');
      panelPreview.classList.remove('is-active');
      tabCode.classList.add('is-active');
      tabPreview.classList.remove('is-active');
    }

    function showPreview() {
      panelPreview.classList.add('is-active');
      panelCode.classList.remove('is-active');
      tabPreview.classList.add('is-active');
      tabCode.classList.remove('is-active');
      requestAnimationFrame(() => panelPreview.classList.add('is-stagger'));
    }

    tabCode.addEventListener('click', () => {
      userInteracted = true;
      clearTimeout(autoTimer);
      showCode();
    });
    tabPreview.addEventListener('click', () => {
      userInteracted = true;
      clearTimeout(autoTimer);
      showPreview();
    });

    function typeWriter() {
      if (reduceMotion) {
        typedCodeEl.innerHTML = highlightedCode;
        if (cursorEl) cursorEl.style.display = 'none';
        return;
      }
      let i = 0;
      const speed = 16;
      function tick() {
        if (i <= plainCode.length) {
          typedCodeEl.textContent = plainCode.slice(0, i);
          i++;
          setTimeout(tick, speed);
        } else {
          typedCodeEl.innerHTML = highlightedCode;
          if (!userInteracted) {
            autoTimer = setTimeout(showPreview, 1100);
          }
        }
      }
      tick();
    }

    let demoStarted = false;
    const demoObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !demoStarted) {
            demoStarted = true;
            setTimeout(typeWriter, 350);
            demoObs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    demoObs.observe(demo);
  }

// OU (mais simples e garantido):
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});

});