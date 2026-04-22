/* OohMyPub — Testimonials carousel (auto-rotate + prev/next/dots) */
(() => {
  'use strict';

  const wrap = document.getElementById('testimonialsCards');
  if (!wrap) return;

  const cards = Array.from(wrap.querySelectorAll('.testimonial-card'));
  const dots  = Array.from(document.querySelectorAll('#testimonialDots .nav-dot'));
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (!cards.length) return;

  const AUTO_ROTATE_MS = 6000;
  const total = cards.length;
  let activeIndex = 0;
  let timer = null;

  const setActive = (index) => {
    activeIndex = ((index % total) + total) % total;
    cards.forEach((c, i) => c.classList.toggle('is-active', i === activeIndex));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
  };

  const next = () => setActive(activeIndex + 1);
  const prev = () => setActive(activeIndex - 1);

  const startAuto = () => {
    stopAuto();
    timer = setInterval(next, AUTO_ROTATE_MS);
  };
  const stopAuto = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };
  const restartAuto = () => { stopAuto(); startAuto(); };

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAuto(); });

  dots.forEach((d, i) => {
    d.addEventListener('click', () => { setActive(i); restartAuto(); });
  });

  // Pause on hover
  const stage = wrap.closest('.testimonials-layout') || wrap;
  stage.addEventListener('mouseenter', stopAuto);
  stage.addEventListener('mouseleave', startAuto);

  // Keyboard support
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prev(); restartAuto(); }
    if (e.key === 'ArrowRight') { next(); restartAuto(); }
  });

  // Respect reduced motion — no auto rotate
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  setActive(0);
  if (!reduced) startAuto();
})();
