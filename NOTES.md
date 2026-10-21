# SewaFest — Project Handoff Note

> Paste this whole file into a fresh Kiro (or any AI) chat on another device to get fully up to speed.
> Last updated: after adding the Paket EO (Event Organizer) feature.

---

## 1. One-line summary

SewaFest is a **web prototype** for a two-sided event-equipment rental **marketplace** in Bekasi, Indonesia, that also offers a **turnkey Event Organizer ("terima jadi") model** where SewaFest itself organizes complete event packages. Built as a vanilla HTML/CSS/JS single-page app — no frameworks, no build step.

Tagline: **"Rayakan Lebih Bijak, Sewa Lebih Mudah."**
Team: **Kelompok 4 — Creativity & Innovation.**

## 2. Where everything lives

- **GitHub repo:** https://github.com/alktin/sewafest
- **Live site (GitHub Pages):** https://alktin.github.io/sewafest
- **Local path (original machine):** `c:\Users\Deco\Downloads\Venture Creation\prototype`
- Source brief/docs (PDFs) are in the parent `Venture Creation` folder (Final Project deck, 10 Pertanyaan, Robust Design Factors, Infografik/Mind Map).

To continue on a new machine: clone the repo (or download the `prototype` folder), open it, and start editing. It runs by just opening `index.html` in a browser.

## 3. What the product is (concept)

- **Problem:** rental vendors are scattered on WhatsApp/Instagram, prices aren't transparent, manual booking causes double-booking, quality is inconsistent, local UMKM struggle to go digital.
- **Solution — two sides + two ways to use it:**
  - **Penyewa (customer)** browses, compares, books, pays, reviews.
  - **Vendor (UMKM)** manages products, orders, availability, income.
  - **Two ways for the customer:**
    1. **Sewa Sendiri** — DIY marketplace, pick individual items.
    2. **Paket EO (terima jadi)** — SewaFest acts as the Event Organizer: customer picks a package (or submits a brief) and SewaFest coordinates vendors/catering/decor/sound/setup. (Added per dosen feedback: "jadi EO biar customer terima jadi.")
- **Personas:** Sari (ibu rumah tangga, hemat), Dika (event organizer freelance), Pak Hendra (vendor tenda).
- **Business model:** two-sided marketplace, commission 5–10% per transaction; EO adds an organizer fee / package margin on top; upsells: vendor subscription, featured listing, insurance add-on.
- **SDGs:** 8 (decent work), 11 (sustainable cities), 12 (responsible consumption).

## 4. Tech & architecture

- **Pure static site:** HTML + CSS + vanilla JS. No backend, no npm, no build. Data is mock, in-memory (refreshing resets state).
- **SPA with a hash router.** Each page is a function in a `Routes` table that returns `{ tab, body, after? }`:
  - `body` = HTML string injected into `#screen`.
  - `tab` = which top-nav item is active (mapped via `navActiveKey`).
  - `after()` = optional hook run after render to bind events / draw calendar & charts.
- **Persistent top navbar** (web-first, desktop-first but responsive) + footer. Earlier it was a mobile phone-frame; it was converted to a full web layout.
- **Images:** real photos hotlinked from Unsplash via the `img(photoId, w)` helper in `data.js`. `imgTag(src, alt, cls, fallbackCat, fallbackIcon)` in `app.js` renders `<img>` with an onerror fallback to a gradient box + emoji (so it degrades gracefully offline).
- **Prototype "today" = 4 Oct 2026**; calendar defaults to October 2026 (`State.calMonth = 9`, `State.calYear = 2026`).
- **Language:** UI is in Indonesian.

## 5. File map

```
prototype/
├── index.html          # Shell: top navbar (#navLinks/#navSearch/#navActions/#globalSearch/#navBurger),
│                        #screen main, footer, #toast. Loads all scripts (order matters; pages-vendor.js last = bootstrap).
├── styles.css          # Full web-first design system (brand, navbar, grids, calendar, chart, EO components, responsive).
├── data.js             # Mock data + image helper. CATEGORIES, VENDORS(v1–v4), PRODUCTS(p1–p12), REVIEWS,
│                        PACKAGES(4 EO packages)+getPackage(), makeAvailability(), ORDERS, CHATS,
│                        VENDOR_ME, VENDOR_INVENTORY, VENDOR_ORDERS, VENDOR_INCOME, VENDOR_CHATS, rupiah()/rupiahShort().
├── app.js              # Framework: State, hash router render(), renderNavbar()+navActiveKey(), imgTag(),
│                        productCard(), catBg(), pageHead(), toast(), go(), event delegation, mobile burger menu.
│                        Legacy no-op stubs: barHome/barBack/vBack/renderJumpLinks/renderTabbar.
├── pages-customer.js   # splash, login, signup, home (2 ways + popular products + popular EO packages),
│                        search (marketplace w/ filter+sort), product/:id (2-col detail+gallery), vendor/:id (profile), profile.
├── pages-booking.js    # book/:id (availability calendar + qty), renderCalendar(), cart, checkout, payment/:method
│                        (waiting→success/cancel), dayDiff().
├── pages-orders.js     # orders (filter tabs), order/:id (status timeline), review/:id (star picker), chats, chat/:vendorId.
├── pages-packages.js   # PAKET EO: packages (listing+hero+steps), package/:id (includes+timeline),
│                        eo-request/:preselect? (brief form), packageCard().
├── pages-vendor.js     # v-home (dashboard), v-orders, v-order/:id (accept/reject), v-inventory, v-calendar
│                        (renderVendorCalendar), v-insights (income comparison chart), v-chats, v-chat/:id,
│                        renderIncomeChart(). >>> Contains the DOMContentLoaded BOOTSTRAP that calls render(). <<<
├── README.md           # User-facing readme (how to run + feature list).
├── NOTES.md            # (this file)
├── .nojekyll           # tells GitHub Pages to skip Jekyll processing
└── .gitignore          # ignores temp/verify files
```

## 6. All routes (hash → page)

Customer: `splash`, `login`, `signup`, `home`, `search`(/:cat), `product/:id`, `vendor/:id`, `profile`,
`book/:id`, `cart`, `checkout`, `payment/:method`, `orders`, `order/:id`, `review/:id`, `chats`, `chat/:vendorId`.
EO: `packages`, `package/:id`, `eo-request`(/:preselectPackageId).
Vendor: `v-home`, `v-orders`, `v-order/:id`, `v-inventory`, `v-calendar`, `v-insights`, `v-chats`, `v-chat/:id`.
(28 routes total. App starts at `#home`.)

## 7. Feature checklist (what's built)

Customer:
- [x] Home with hero, "Sewa Sendiri vs EO" split, categories, popular products, popular EO packages, vendor CTA.
- [x] Marketplace: search, category chips, sort (popular/price/rating). Global navbar search syncs to it.
- [x] Product detail: image gallery (thumbnails switch main image), specs, vendor row, reviews, Sewa Sekarang.
- [x] Vendor profile: cover + logo, stats (rating/orders/response), bio, product portfolio.
- [x] Booking: availability calendar (available/limited/booked + date-range select), qty stepper.
- [x] Cart → Checkout (address + VA/GoPay/QRIS) → Payment (waiting w/ countdown → success/cancel).
- [x] Orders: filter tabs, detail with status timeline, review form (star picker).
- [x] Chat: inbox + thread with auto-reply.

Paket EO (SewaFest as organizer):
- [x] Packages listing: hero, 4-step "how it works", 4 packages (Ulang Tahun Anak, Lamaran, 7 Bulanan/Aqiqah, Gathering).
- [x] Package detail: "sudah termasuk" list, timeline, trust note, Pesan Paket / Tanya Dulu.
- [x] eo-request brief form (jenis acara, tanggal, tamu, budget, lokasi, catatan) → confirmation toast.

Vendor:
- [x] Dashboard (metrics, new orders, quick access, mini income chart).
- [x] Order management (accept/reject/mark done), inventory/gudang (stock bars),
      availability calendar (click to cycle status), insights (month-over-month income bar chart), chat.

## 8. Design system quick ref

- Fonts: `Fraunces` (display headings) + `Plus Jakarta Sans` (body).
- Brand colors (CSS vars in `:root`): `--plum-900/800/700`, `--magenta`, `--gold`, `--mint`, `--coral`.
  Gradients: `--grad-brand` (plum→magenta), `--grad-gold`.
- Key classes: `.container`(/`--narrow`), `.btn`(`--primary/gold/ghost/dark/block/sm/lg`), `.card`, `.note`,
  `.prod-grid`/`.pcard`, `.pkg-grid`/`.pkg-card`, `.two-ways`/`.way`, `.eo-steps`/`.eo-step`, `.eo-incl`,
  `.cal`/`.cal__grid`/`.cal__cell`, `.chart`, `.detail`(/`.detail--split`), `.status-pill`, `.tag`.
- Responsive breakpoints: 1024 / 860 (nav collapses to burger; split grids stack) / 560 / 380.

## 9. Known gotchas / history (so you don't re-break these)

- **Calendar must use `grid-auto-rows` + `grid-template-rows: auto` for the header row** — NOT `aspect-ratio` on cells.
  History: `aspect-ratio` caused uneven/huge rows and a big gap under the day-of-week labels in months with a
  short first week (e.g. Dec 2026, May 2027). Columns use `repeat(7, minmax(0,1fr))` so all 7 size equally.
- **Two-column pages use `.detail--split` class, NOT inline `grid-template-columns`** — inline styles beat the
  media query and broke mobile. The class collapses to 1 column below 860px.
- **Navbar on mobile:** the Penyewa/Vendor mode switch + chat + avatar are hidden from the top bar and moved into
  the burger dropdown (`#navLinks.open`), otherwise the bar overflowed and scrolled sideways. Burger toggle is
  wired in `renderNavbar`.
- **`imgTag` onerror** swaps a failed image for a gradient box + emoji — keep this so it survives offline.
- **Script load order matters:** `pages-vendor.js` holds the `DOMContentLoaded` bootstrap and must load last.
- `router` ignores any legacy `topbar:` field; stubs exist so old code doesn't throw.

## 10. How to run / verify / deploy

- **Run:** open `index.html` in a browser (needs internet for Unsplash photos). No build.
- **Verify (no browser):** historically used Node + a small DOM-shim harness + `node --check` on each JS file.
  (`git`/`npm`/`gh` are NOT installed on the original Windows machine; `node` works. npm is blocked by PS exec policy.)
- **Deploy:** GitHub Pages, Settings → Pages → Deploy from a branch → `main` → `/root`. `index.html` must be at repo root.
  After upload, the "pages build and deployment" Action runs (~1 min). Hard-refresh to beat mobile cache.

## 11. Open ideas / backlog (from user-interview feedback grid)

High priority / bugs:
- Date-range bug: if a middle date in the selected range is "booked", it's still counted as available — fix range validation.
- Clarify the "Terbatas" calendar status (tooltip/label — what does it mean?).
- Vendor calendar should auto-update when an order comes in (currently manual click).

Requested features:
- Price filter (e.g. show products under Rp 3.5jt).
- Hourly rental option (not only per-day).
- Clear info on whether price includes delivery & setup.
- Customer protection / guarantee info.
- Fuller product specs; real product photos (replace Unsplash); tidy up logos/images.
- Catering: menu detail + food tasting info.
- Vendor: financial/transaction history + late-return rules.
- (Possible) swap emoji icons for exported Figma SVG/PNG elements.
- Business-model slide update: add EO organizer fee / package margin on top of marketplace commission.

## 12. Suggested first prompt on the new device

> "Continuing the SewaFest prototype. Repo: github.com/alktin/sewafest, live: alktin.github.io/sewafest.
> Read NOTES.md in the prototype folder for full context. It's a vanilla HTML/CSS/JS SPA (hash router, Routes table)
> — two-sided Bekasi rental marketplace + a Paket EO 'terima jadi' model where SewaFest organizes packages.
> Next I want to: ______."
