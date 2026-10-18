/* Flavors Kitchen + Bar — shared interactions */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNav() {
    const nav = document.getElementById("mainNav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const btn = document.getElementById("hamburgerBtn");
    const mob = document.getElementById("mobileMenu");
    if (!btn || !mob) return;

    function setMenuOpen(open) {
      mob.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mob.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("mobile-menu-open", open);
      if (open) {
        mob.scrollTop = 0;
      }
    }

    btn.addEventListener("click", () => {
      setMenuOpen(!mob.classList.contains("open"));
    });

    mob.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mob.classList.contains("open")) setMenuOpen(false);
    });

    window.closeMobile = function closeMobile() {
      setMenuOpen(false);
    };
  }

  function initReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));

    requestAnimationFrame(() => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      reveals.forEach((el) => {
        if (el.classList.contains("visible")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      });
    });
  }

  // Only one FAQ answer open at a time
  function initFaq() {
    const items = document.querySelectorAll(".faq-list details");
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => { if (other !== item) other.open = false; });
      });
    });
  }

  // Kora form submission — every <form data-kora-form="<form_type>"> posts to the
  // Kora public forms endpoint with a reCAPTCHA v2 token. Fields are sent by name.
  let recaptchaLoaded = false;
  function loadRecaptcha() {
    if (recaptchaLoaded) return;
    recaptchaLoaded = true;
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  function initForms() {
    const forms = document.querySelectorAll("form[data-kora-form]");
    if (!forms.length) return;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    forms.forEach((form) => {
      const statusEl = form.querySelector(".form-status");
      const submitBtn = form.querySelector('[type="submit"]');
      const submitLabel = submitBtn ? submitBtn.textContent : "";
      const captchaEl = form.querySelector(".g-recaptcha");

      function setStatus(kind, msg) {
        if (!statusEl) return;
        statusEl.className = "form-status" + (kind ? " is-" + kind : "");
        statusEl.textContent = msg || "";
        statusEl.hidden = !msg;
      }

      form.addEventListener("focusin", loadRecaptcha, { once: true });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        loadRecaptcha();
        setStatus(null, "");

        const data = {};
        form.querySelectorAll("input[name], textarea[name], select[name]").forEach((f) => {
          if (f.name === "g-recaptcha-response") return;
          if (f.type === "checkbox") data[f.name] = f.checked;
          else if (f.type === "radio") { if (f.checked) data[f.name] = f.value; }
          else if (f.value.trim()) data[f.name] = f.value.trim();
        });

        const missing = Array.from(form.querySelectorAll("[required]")).some((f) => !String(f.value || "").trim());
        if (missing) {
          setStatus("error", form.getAttribute("data-required-msg") || "Please fill out the required fields.");
          return;
        }
        if (data.email && !emailPattern.test(data.email)) {
          setStatus("error", "Please enter a valid email address.");
          return;
        }
        if (typeof grecaptcha === "undefined") {
          setStatus("error", "Security check loading — please try again in a moment.");
          return;
        }
        // Each form renders its own widget; widgets are numbered in page order
        const widgetIndex = Array.from(document.querySelectorAll(".g-recaptcha")).indexOf(captchaEl);
        const token = grecaptcha.getResponse(widgetIndex > -1 ? widgetIndex : undefined);
        if (!token) {
          setStatus("error", "Please complete the security check.");
          return;
        }

        const cfg = window.KORA_SITE_CONFIG || window.KORA_CONFIG || {};
        const apiBaseUrl = (cfg.apiBaseUrl || "").replace(/\/+$/, "");
        const payload = {
          business_id: cfg.businessId,
          form_type: form.getAttribute("data-kora-form"),
          form_data: data,
          submitter_email: data.email,
          captcha_token: token
        };

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending…";
        }

        fetch(apiBaseUrl + "/api/v1/public/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then((res) => {
            if (!res.ok) throw new Error("Submission failed");
            return res.json().catch(() => ({}));
          })
          .then(() => {
            setStatus("success", form.getAttribute("data-success-msg") || "Thanks — we got it.");
            form.reset();
            if (typeof grecaptcha !== "undefined") grecaptcha.reset(widgetIndex > -1 ? widgetIndex : undefined);
          })
          .catch(() => {
            setStatus("error", "Something went wrong sending that. Please try again in a moment.");
          })
          .finally(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = submitLabel;
            }
          });
      });
    });
  }

  function init() {
    initNav();
    initReveal();
    initFaq();
    initForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
