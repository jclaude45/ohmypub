/* OohMyPub — interactions */
(() => {
  "use strict";

  /* --- Header scroll state (scrolled shadow + retract on scroll down) --- */
  const header = document.getElementById("siteHeader");
  let lastScrollY = window.scrollY;
  const RETRACT_THRESHOLD = 100;
  const DIFF_THRESHOLD = 6;

  const onScroll = () => {
    if (!header) return;
    const y = window.scrollY;
    const diff = y - lastScrollY;

    header.classList.toggle("is-scrolled", y > 10);

    if (y < RETRACT_THRESHOLD) {
      header.classList.remove("is-hidden");
    } else if (diff > DIFF_THRESHOLD) {
      header.classList.add("is-hidden");      // scroll down → cacher
    } else if (diff < -DIFF_THRESHOLD) {
      header.classList.remove("is-hidden");   // scroll up → montrer
    }
    lastScrollY = y;

    const toTop = document.querySelector(".to-top");
    if (toTop) toTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Burger / mobile menu --- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      mobileMenu.setAttribute("aria-hidden", String(!open));
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
      })
    );
  }

  /* --- Services tabs --- */
  const tabs = document.querySelectorAll(".services-tabs .tab");
  const cards = document.querySelectorAll(".svc-card");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
      });
      cards.forEach((c) => c.classList.toggle("active", c.id === target));
    });
  });

  /* --- Reveal on scroll --- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* --- Active nav link on scroll --- */
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const updateActiveNav = () => {
    const pos = window.scrollY + 120;
    let current = sections[0]?.id;
    sections.forEach((s) => {
      if (s.offsetTop <= pos) current = s.id;
    });
    navLinks.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* --- Contact form (client-side validation & feedback) --- */
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  if (form && feedback) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      feedback.className = "form-feedback";
      feedback.textContent = "";

      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const service = (data.get("service") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !service || !message) {
        feedback.classList.add("error");
        feedback.textContent = "Merci de remplir tous les champs requis.";
        return;
      }
      if (!emailOk) {
        feedback.classList.add("error");
        feedback.textContent = "L'adresse email ne semble pas valide.";
        return;
      }

      feedback.classList.add("success");
      feedback.textContent = `Merci ${name} ! Votre demande a bien été enregistrée, nous revenons vers vous sous 24h.`;
      form.reset();
    });
  }

  /* --- Footer year --- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
