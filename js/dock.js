/* OohMyPub — Animated dock (macOS-style proximity scaling) */
(() => {
  'use strict';

  const docks = document.querySelectorAll('.animated-dock');
  if (!docks.length) return;

  // Respect motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Config — matches the React reference (width 40→80, scale 1→1.5)
  const BASE_SIZE = 40;
  const MAX_SIZE = 80;
  const BASE_SCALE = 1;
  const MAX_SCALE = 1.5;
  const RANGE = 150;     // influence radius in px
  const LERP = 0.22;     // smoothing factor (approx spring)

  docks.forEach(initDock);

  function initDock(dock) {
    const items = Array.from(dock.querySelectorAll('.dock-item')).map(el => ({
      el,
      icon: el.querySelector('.dock-icon'),
      w: BASE_SIZE, tw: BASE_SIZE,
      s: BASE_SCALE, ts: BASE_SCALE,
    }));
    if (!items.length) return;

    let mouseX = Infinity;
    let rafId = null;
    let running = false;

    const computeTargets = () => {
      items.forEach(item => {
        const rect = item.el.getBoundingClientRect();
        const center = rect.x + rect.width / 2;
        const dist = mouseX === Infinity ? RANGE + 1 : Math.abs(mouseX - center);
        const t = Math.max(0, 1 - dist / RANGE);
        item.tw = BASE_SIZE + t * (MAX_SIZE - BASE_SIZE);
        item.ts = BASE_SCALE + t * (MAX_SCALE - BASE_SCALE);
      });
    };

    const tick = () => {
      let stillMoving = false;
      items.forEach(item => {
        const dw = item.tw - item.w;
        const ds = item.ts - item.s;
        if (Math.abs(dw) > 0.05 || Math.abs(ds) > 0.002) stillMoving = true;
        item.w += dw * LERP;
        item.s += ds * LERP;
        item.el.style.width = item.w.toFixed(2) + 'px';
        item.el.style.height = item.w.toFixed(2) + 'px';
        if (item.icon) item.icon.style.transform = 'scale(' + item.s.toFixed(3) + ')';
      });
      if (stillMoving) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    dock.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      computeTargets();
      startLoop();
    });
    dock.addEventListener('mouseleave', () => {
      mouseX = Infinity;
      computeTargets();
      startLoop();
    });
  }
})();
