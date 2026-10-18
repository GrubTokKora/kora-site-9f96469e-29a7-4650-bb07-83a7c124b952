/* Flavors Kitchen + Bar — shared chrome */
(function () {
  // The business's own details. Empty values are not yet announced — the site
  // shows "Coming soon" / "To be announced" wherever one is blank.
  const NAME = "Flavors Kitchen + Bar";
  const ADDRESS_1 = "720 N Bedford Rd";
  const ADDRESS_2 = "Bedford, NY 10506";
  const MAPS = "https://www.google.com/maps/search/?api=1&query=720+N+Bedford+Rd%2C+Bedford%2C+NY+10506";
  const PHONE = "";          // e.g. "9145550100" once assigned
  const PHONE_DISPLAY = "";  // e.g. "(914) 555-0100"
  const EMAIL = "";
  const INSTAGRAM = "";
  const ORDER = "";          // online ordering link, once live
  const HOURS = [];          // e.g. [["Tue – Thu", "5 – 10 pm"], ...]
  const LOGO = "assets/brand/logo.svg";
  const LOGO_REVERSED = "assets/brand/logo-reversed.svg";

  const FEATURES = {
    accessibilityWidget: {
      enabled: true,
      provider: "sinanisler"
    }
  };

  window.FLV_LINKS = { NAME, ADDRESS_1, ADDRESS_2, MAPS, PHONE, PHONE_DISPLAY, EMAIL, INSTAGRAM, ORDER, HOURS, LOGO, LOGO_REVERSED };
  window.FLV_FEATURES = FEATURES;
  window.features = FEATURES;

  function initAccessibility() {
    if (!FEATURES.accessibilityWidget.enabled) return;
    if (document.getElementById("sinanisler-accessibility-script")) return;
    const script = document.createElement("script");
    script.id = "sinanisler-accessibility-script";
    script.src = "https://cdn.jsdelivr.net/gh/sinanisler/accessibility@latest/dist/accessibility.min.js";
    script.async = true;
    script.onload = function () {
      function start() {
        try {
          if (typeof Accessibility !== "undefined") {
            new Accessibility();
          }
        } catch (e) {
          console.error("Accessibility widget init error", e);
        }
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
      } else {
        start();
      }
    };
    (document.head || document.documentElement).appendChild(script);
  }

  initAccessibility();

  function active(page, id) {
    return page === id ? ' aria-current="page"' : "";
  }

  // The site's full page list — shared by the desktop nav and the mobile menu.
  // Each entry carries the logo colour its nav pill fills with when active.
  const PAGES = [
    ["home", "index.html", "Home", "yellow"],
    ["menu", "menu.html", "Menu", "teal"],
    ["bar", "bar.html", "Bar", "purple"],
    ["visit", "visit.html", "Visit", "coral"],
  ];

  function fullNav(page) {
    return PAGES.map(([id, href, label]) => `<a href="${href}"${active(page, id)}>${label}</a>`);
  }

  // The header CTA: Order Online once ordering is live, otherwise the opening-updates sign-up
  function cta() {
    return ORDER
      ? { href: ORDER, label: "Order Online", ext: ' target="_blank" rel="noopener noreferrer"' }
      : { href: "index.html#notify", label: "Get Updates", ext: "" };
  }

  function mountNav(el, page) {
    const c = cta();
    el.innerHTML = `
<div class="nav-inner">
  <a class="nav-logo" href="index.html" aria-label="${NAME} — home">
    <img alt="${NAME}" src="${LOGO}" width="162" height="30"/>
  </a>
  <ul class="nav-links">
    ${PAGES.slice(1).map(([id, href, label, color]) => `<li><a class="nav-pill nav-pill--${color}" href="${href}"${active(page, id)}>${label}</a></li>`).join("\n    ")}
  </ul>
  <a class="btn btn-primary nav-cta" href="${c.href}"${c.ext}>${c.label}</a>
  ${PHONE ? `<a class="nav-call-btn" href="tel:${PHONE}" aria-label="Call ${PHONE_DISPLAY}">Call</a>` : ""}
  <button aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu" class="nav-hamburger" id="hamburgerBtn" type="button">
    <span></span><span></span><span></span>
  </button>
</div>`;
  }

  function mountMobile(el, page) {
    const c = cta();
    el.innerHTML = `
${fullNav(page).map((l) => l.replace("<a ", '<a class="mobile-nav-link" ')).join("\n")}
<a class="btn btn-accent btn-lg mobile-nav-cta" href="${c.href}"${c.ext}>${c.label}</a>`;
  }

  function hoursHtml() {
    if (!HOURS.length) return '<span class="tba">To be announced</span>';
    return HOURS.map(([d, h]) => `<span class="visit-hours-row"><span>${d}</span><span>${h}</span></span>`).join("");
  }

  function mountFooter(el) {
    const koraBranding = Array.from(
      el.querySelectorAll('[data-kora-branding-footer="true"], .kora-powered-by')
    );

    el.innerHTML = `
<div class="footer-inner">
  <div class="footer-brand">
    <img alt="${NAME}" src="${LOGO_REVERSED}" width="220" height="61"/>
    <p class="footer-tag">A little taste of everywhere.</p>
    ${INSTAGRAM || EMAIL ? `<div class="footer-social-links">
      ${INSTAGRAM ? `<a aria-label="Instagram" href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer"><svg fill="none" height="18" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" width="18" aria-hidden="true"><rect height="20" rx="5" width="20" x="2" y="2"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" fill="currentColor" r="1" stroke="none"></circle></svg></a>` : ""}
      ${EMAIL ? `<a aria-label="Email" href="mailto:${EMAIL}"><svg fill="none" height="18" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" width="18" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 6L2 7"></path></svg></a>` : ""}
    </div>` : ""}
  </div>
  <dl class="visit-info visit-info--dark">
    <div class="visit-row"><dt>Address</dt><dd><a href="${MAPS}" target="_blank" rel="noopener noreferrer">${ADDRESS_1}<br/>${ADDRESS_2}</a></dd></div>
    <div class="visit-row"><dt>Phone</dt><dd>${PHONE ? `<a href="tel:${PHONE}">${PHONE_DISPLAY}</a>` : '<span class="tba">Coming soon</span>'}</dd></div>
    <div class="visit-row"><dt>Hours</dt><dd>${hoursHtml()}</dd></div>
  </dl>
  <div class="footer-notify">
    <div class="footer-notify-title">Get the opening date.</div>
    <p>One email when the doors open. That's it.</p>
    <a class="btn btn-accent" href="index.html#notify">Notify me</a>
  </div>
</div>
<div class="footer-bottom">
  <p>© ${new Date().getFullYear()} ${NAME}. All rights reserved.</p>
  <ul class="footer-links">
    ${PAGES.map(([, href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}
  </ul>
</div>
<div class="color-bar" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>`;

    koraBranding.forEach((node) => el.appendChild(node));
  }

  // Fill any in-page [data-visit] block with the same details the footer uses
  function mountVisit(el) {
    el.innerHTML = `
<div class="visit-row"><dt>Address</dt><dd><a href="${MAPS}" target="_blank" rel="noopener noreferrer">${ADDRESS_1}<br/>${ADDRESS_2}</a></dd></div>
<div class="visit-row"><dt>Phone</dt><dd>${PHONE ? `<a href="tel:${PHONE}">${PHONE_DISPLAY}</a>` : '<span class="tba">Coming soon</span>'}</dd></div>
<div class="visit-row"><dt>Hours</dt><dd>${hoursHtml()}</dd></div>`;
  }

  function init() {
    const page = document.body.getAttribute("data-page") || "home";
    const nav = document.getElementById("mainNav");
    const mobile = document.getElementById("mobileMenu");
    const footer = document.querySelector("footer[data-footer]");
    if (nav) mountNav(nav, page);
    if (mobile) mountMobile(mobile, page);
    if (footer) mountFooter(footer);
    document.querySelectorAll("[data-visit]").forEach(mountVisit);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
