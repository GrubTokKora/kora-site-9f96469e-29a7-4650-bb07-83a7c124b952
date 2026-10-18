# Site index · format 2
Structure and the names of what each page offers. Values that change often — prices, hours, phone,
address — and body copy are deliberately not recorded here; read the page itself for those.

## index.html → /
title: Flavors Kitchen + Bar — Opening Soon in Bedford, NY
purpose: The pre-opening landing page — what Flavors will be, where it is, and the sign-up for the opening date.
sections:
- `#main` — the page body, holding the hero and every section below it
- `#home` "Eat the whole map." — the yellow hero with the Opening Soon badge, the Get the opening date and What we're cooking actions, and the logo-shapes illustration
- `#explore` — three colour tiles onward: Pizza (menu.html#pizza), Plates (menu.html#world-plates), Pours (bar.html)
- `#coming` "What's coming out of the kitchen." — four concept cards: Pizza, World plates, Small plates, Cocktails (no dishes or prices)
- `#about` "Dinner first. Then the bar." — the restaurant's story
- `#visit` "Come find us." — address, phone and hours block (filled from js/includes.js) with directions and message actions
- `#notify` "Be first through the door." — the opening-updates sign-up form (Kora form, form_type contact)
- `#faq` "Before we open." — six questions, mirrored in the page's FAQPage JSON-LD; edit both together
also: The FAQ answers say the opening date, phone, hours and reservations are not yet available. Every one of them goes stale on opening day.

## menu.html → /menu
title: Menu — Flavors Kitchen + Bar | Coming Soon to Bedford, NY
purpose: The menu preview — the planned categories, with a notice that the full menu is not yet written.
sections:
- `#main` "Menu" — the page hero with category tags and the menu-coming-soon notice
- `#pizza` "Pizza" — concept and what-to-expect list
- `#world-plates` "World plates" — concept and what-to-expect list
- `#small-plates` "Small plates" — concept and what-to-expect list
- `#cocktails` "Cocktails" — concept, linking to bar.html
- `#notify` "Be the first to see the menu." — the opening-updates sign-up form
also: When the real menu arrives, each category band's list (`.coming-list`) becomes the dish list and the notice in the hero comes out.

## bar.html → /bar
title: Bar — Flavors Kitchen + Bar | Craft Cocktails in Bedford, NY
purpose: The bar page — the cocktail concept before a drinks list exists.
sections:
- `#main` "Bar" — the purple page hero
- "A cocktail list with a passport." — the bar concept with a cocktail-glass shape illustration
- "Pull up a stool." — the visit call to action
- `#notify` "First round's coming." — the opening-updates sign-up form

## visit.html → /visit
title: Visit — Flavors Kitchen + Bar | 720 N Bedford Rd, Bedford, NY
purpose: The visit and contact page — address, phone, hours, directions and the contact form.
sections:
- `#main` "Come find us." — the turquoise page body
- `#location` — the address, phone and hours block (filled from js/includes.js)
- map card — a drawn map tile linking to Google Maps directions (no embedded map)
- `#contact-form` "Send us a message" — the contact form with name, email, optional phone, message, opening-updates opt-in and reCAPTCHA v2, plus the reservations-not-open-yet notice

## support files
Files that are not pages. A line marked [content] holds words or data a visitor reads, so a
change to the site's content can land there; the rest only make the site work or look right.
- `llms.txt` — a plain-text summary of the business for AI crawlers — derived from the site by the deploy, not written by hand
- `robots.txt` — crawler rules and the sitemap link — derived from the site by the deploy, not written by hand
- `sitemap.xml` — the list of page URLs — derived from the site by the deploy, not written by hand
- `src/input.css` — the site's styling: the Flavors logo palette, type scale, colour blocks, hard shadows (compiled into assets/styles.css on every deploy — never edit assets/styles.css)
- `assets/styles.css` — generated from `src/input.css` by the deploy
- `assets/brand/` — logo, reversed logo, wordmarks, favicon, touch icon and the 1200×630 share image
- `js/includes.js` — THE BUSINESS'S OWN DETAILS AND LINKS used across every page — address, maps link, phone, email, Instagram, ordering link, hours. Blank values render as "Coming soon" / "To be announced"; filling one in updates the header, footer and every visit block at once  [content]
- `js/main.js` — mobile menu, scroll state, reveal motion, FAQ accordion and the shared Kora form submission for every `form[data-kora-form]`

## shared (every page)
The desktop nav is Menu, Bar, Visit as outlined pills (the current page fills with its logo colour) and a Get Updates button that becomes Order Online once `ORDER` is set in js/includes.js; on mobile a hamburger opens a full-screen yellow menu, and a Call button appears once `PHONE` is set.
The header, navigation, mobile menu and footer are built by js/includes.js on every page. Every page with a form carries the same inline `KORA_SITE_CONFIG` block; its businessId is this business's Kora ID.
