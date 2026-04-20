/* OohMyPub — interactions */
(() => {
  "use strict";

  /* --- Config --- */
  // Colle ici l'URL "Catch Hook" fournie par Zapier après création du Zap.
  // Exemple : https://hooks.zapier.com/hooks/catch/1234567/abcde12/
  const ZAPIER_WEBHOOK_URL = "";

  /* --- Header scroll state --- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    const toTop = document.querySelector(".to-top");
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
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

  /* --- Contact form (validation + Zapier webhook) --- */
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  if (form && feedback) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultBtnLabel = submitBtn ? submitBtn.textContent : "";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      feedback.className = "form-feedback";
      feedback.textContent = "";

      const data = new FormData(form);
      const payload = {
        name: (data.get("name") || "").toString().trim(),
        email: (data.get("email") || "").toString().trim(),
        phone: (data.get("phone") || "").toString().trim(),
        service: (data.get("service") || "").toString().trim(),
        message: (data.get("message") || "").toString().trim(),
        submitted_at: new Date().toISOString(),
        source: "oohmypub.com/contact",
      };

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);

      if (!payload.name || !payload.email || !payload.service || !payload.message) {
        feedback.classList.add("error");
        feedback.textContent = "Merci de remplir tous les champs requis.";
        return;
      }
      if (!emailOk) {
        feedback.classList.add("error");
        feedback.textContent = "L'adresse email ne semble pas valide.";
        return;
      }

      if (!ZAPIER_WEBHOOK_URL) {
        feedback.classList.add("error");
        feedback.textContent = "Formulaire non configuré. Merci de nous contacter par téléphone.";
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Envoi en cours…";
      }

      try {
        const res = await fetch(ZAPIER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);

        feedback.classList.add("success");
        feedback.textContent = `Merci ${payload.name} ! Votre demande est enregistrée, nous revenons vers vous sous 24h.`;
        form.reset();
      } catch (err) {
        feedback.classList.add("error");
        feedback.textContent = "Oups, l'envoi a échoué. Réessayez ou écrivez-nous à Janclyeale@oohmypub.com.";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnLabel;
        }
      }
    });
  }

  /* --- Footer year --- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
