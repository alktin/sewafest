/* ============================================================
   SewaFest — SPA framework + page renderers (web-first)
   ============================================================ */

// ---------- Global state ----------
const State = {
  app: "customer",          // "customer" | "vendor"
  cart: [],                 // [{productId, qty, start, end}]
  favorites: new Set(),
  draft: { productId: null, qty: 1, start: null, end: null, payment: "va" },
  calMonth: 9,              // October (0-indexed) 2026
  calYear: 2026,
};

// ---------- DOM refs ----------
const $screen = document.getElementById("screen");
const $toast = document.getElementById("toast");
const $navLinks = document.getElementById("navLinks");
const $navActions = document.getElementById("navActions");
const $navSearch = document.getElementById("navSearch");
const $globalSearch = document.getElementById("globalSearch");
const $footer = document.getElementById("footer");

// ---------- Utilities ----------
function money(n) { return rupiah(n); }
function toast(msg) {
  $toast.textContent = msg;
  $toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => $toast.classList.remove("show"), 2200);
}
function go(route) { location.hash = "#" + route; }
function cartCount() { return State.cart.reduce((s, i) => s + i.qty, 0); }
function stars(n) {
  const full = Math.round(n);
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DOW = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

// Image <img> with graceful fallback to category gradient + emoji.
// On load error, swap the <img> for a gradient box showing the emoji so the
// layout never breaks even if a CDN image is unavailable offline.
function imgTag(src, alt, cls, fallbackCat, fallbackIcon) {
  const bg = fallbackCat ? catBg(fallbackCat) : "var(--bg-tint)";
  const ic = fallbackIcon || "🎉";
  const handler = `this.outerHTML='<div class=\\'${cls} img-fallback\\' style=\\'background:${bg}\\'>${ic}</div>'`;
  return `<img class="${cls}" src="${src}" alt="${escapeHtml(alt || "")}" loading="lazy" onerror="${handler}" />`;
}

// ============================================================
//  ROUTER
// ============================================================
const Routes = {}; // name -> render function

function render() {
  let hash = location.hash.replace(/^#/, "") || (State.app === "vendor" ? "v-home" : "home");
  const [name, ...rest] = hash.split("/");
  const param = rest.join("/");

  // keep app mode in sync with route prefix
  if (name.startsWith("v-") || name === "vendor") State.app = "vendor";
  else if (!["splash","login","signup"].includes(name)) State.app = "customer";

  const isAuth = ["splash","login","signup"].includes(name);
  document.body.classList.toggle("auth-mode", isAuth);

  const fn = Routes[name] || Routes[State.app === "vendor" ? "v-home" : "home"];
  $screen.scrollTop = 0;
  window.scrollTo(0, 0);
  const view = fn(param) || {};
  $screen.innerHTML = `<div class="fade-in">${view.body || ""}</div>`;

  renderNavbar(view.tab, isAuth);
  if (view.after) view.after();
  bindDelegates();
}

window.addEventListener("hashchange", render);

// ---------- Navbar ----------
function renderNavbar(active, isAuth) {
  if (isAuth) { document.getElementById("navbar").style.display = "none"; $footer.style.display = "none"; return; }
  document.getElementById("navbar").style.display = "";
  $footer.style.display = "";

  const links = State.app === "vendor"
    ? [["v-home","Dashboard"],["v-orders","Pesanan"],["v-calendar","Kalender"],["v-insights","Insight"],["v-inventory","Gudang"],["v-chats","Pesan"]]
    : [["home","Beranda"],["search","Marketplace"],["orders","Pesanan"],["chats","Pesan"]];

  // group a route to its nav key for active-state
  const activeKey = navActiveKey(active);
  const linkHtml = links.map(([r, label]) =>
    `<a class="nav-link ${activeKey === r ? "is-active" : ""}" data-go="${r}">${label}</a>`).join("");
  // mobile menu also carries the mode switch (hidden from the top bar on small screens)
  const mobModeSeg = `
    <div class="nav-mob-divider"></div>
    <div class="mode-seg" id="modeSegMob">
      <button data-mode="customer" class="${State.app === "customer" ? "is-active" : ""}">Penyewa</button>
      <button data-mode="vendor" class="${State.app === "vendor" ? "is-active" : ""}">Vendor</button>
    </div>`;
  $navLinks.innerHTML = linkHtml + mobModeSeg;
  $navLinks.classList.remove("open"); // collapse menu on each navigation

  // search only shows in customer mode
  $navSearch.style.display = State.app === "vendor" ? "none" : "";

  // right-side actions
  if (State.app === "vendor") {
    $navActions.innerHTML = `
      <button class="nav-icon" data-go="v-chats" title="Pesan">💬</button>
      <div class="mode-seg" id="modeSeg">
        <button data-mode="customer">Penyewa</button>
        <button data-mode="vendor" class="is-active">Vendor</button>
      </div>
      <div class="nav-avatar" title="${escapeHtml(VENDOR_ME.name)}">${VENDOR_ME.initial}</div>`;
  } else {
    $navActions.innerHTML = `
      <button class="nav-icon cart-dot" data-count="${cartCount()}" data-go="cart" title="Keranjang">🛒</button>
      <div class="mode-seg" id="modeSeg">
        <button data-mode="customer" class="is-active">Penyewa</button>
        <button data-mode="vendor">Vendor</button>
      </div>
      <div class="nav-avatar" data-go="profile" title="Akun">S</div>`;
  }

  // bind mode switch (top bar + mobile menu share this handler)
  const switchMode = (e) => {
    const b = e.target.closest("[data-mode]"); if (!b) return;
    State.app = b.dataset.mode;
    go(State.app === "vendor" ? "v-home" : "home");
  };
  const seg = document.getElementById("modeSeg");
  if (seg) seg.onclick = switchMode;
  const segMob = document.getElementById("modeSegMob");
  if (segMob) segMob.onclick = switchMode;

  // burger toggles the mobile menu
  const burger = document.getElementById("navBurger");
  if (burger) burger.onclick = (e) => { e.stopPropagation(); $navLinks.classList.toggle("open"); };

  // keep global search in sync
  if ($globalSearch) $globalSearch.value = (typeof searchFilter !== "undefined" ? searchFilter.q : "") || "";
}

// Map a page's tab hint to a top-level nav key
function navActiveKey(tab) {
  const map = {
    home: "home", search: "search", product: "search", vendor: "search", book: "search",
    cart: "search", checkout: "search", payment: "search",
    orders: "orders", order: "orders", review: "orders",
    chats: "chats", chat: "chats", profile: "home",
    "v-home": "v-home", "v-orders": "v-orders", "v-order": "v-orders",
    "v-calendar": "v-calendar", "v-insights": "v-insights", "v-inventory": "v-inventory",
    "v-chats": "v-chats", "v-chat": "v-chats",
  };
  return map[tab] || tab;
}

// ---------- Event delegation ----------
function bindDelegates() {
  const handler = (e) => {
    const goEl = e.target.closest("[data-go]");
    if (goEl) { go(goEl.dataset.go); return; }
    const backEl = e.target.closest("[data-back]");
    if (backEl) { history.length > 1 ? history.back() : go("home"); return; }
    const favEl = e.target.closest("[data-fav]");
    if (favEl) { e.stopPropagation(); toggleFav(favEl.dataset.fav); return; }
  };
  $screen.onclick = handler;
  document.getElementById("navbar").onclick = handler;
  $footer.onclick = handler;
}

function toggleFav(id) {
  if (State.favorites.has(id)) { State.favorites.delete(id); toast("Dihapus dari favorit"); }
  else { State.favorites.add(id); toast("Ditambahkan ke favorit 💜"); }
  render();
}

// ---------- Global navbar search ----------
if ($globalSearch) {
  $globalSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (typeof searchFilter !== "undefined") searchFilter.q = $globalSearch.value;
      go("search");
    }
  });
}

// ============================================================
//  Shared card renderers
// ============================================================
function productCard(p) {
  const v = getVendor(p.vendor);
  const fav = State.favorites.has(p.id) ? "💜" : "🤍";
  return `<article class="pcard" data-go="product/${p.id}">
    <div class="pcard__img">
      ${imgTag(p.img, p.name, "pcard__photo", p.cat, p.icon)}
      ${p.badge ? `<span class="pcard__badge">${p.badge}</span>` : ""}
      <span class="pcard__fav" data-fav="${p.id}">${fav}</span>
    </div>
    <div class="pcard__body">
      <div class="pcard__name">${escapeHtml(p.name)}</div>
      <div class="pcard__vendor">${escapeHtml(v.name)} ${v.verified ? '<span class="verified">✓</span>' : ""}</div>
      <div class="pcard__meta">
        <div class="pcard__price"><b>${money(p.price)}</b> <span>/${p.unit}</span></div>
        <span class="rate">★ ${p.rating}</span>
      </div>
    </div>
  </article>`;
}

function catBg(cat) {
  const map = {
    tenda: "linear-gradient(135deg,#ffe7cf,#ffd0a8)",
    sound: "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
    dekor: "linear-gradient(135deg,#ffe0f0,#ffc6e3)",
    kursi: "linear-gradient(135deg,#e6f7f1,#c9f4ea)",
    catering: "linear-gradient(135deg,#fff2d6,#ffe0a3)",
    panggung: "linear-gradient(135deg,#efd9f6,#e0bdf0)",
    lampu: "linear-gradient(135deg,#fff6cc,#ffe9a3)",
    lainnya: "linear-gradient(135deg,#f4ecf7,#e9d9f0)",
  };
  return map[cat] || map.lainnya;
}

// Page header (breadcrumb-style) used by inner pages
function pageHead(title, sub, backRoute) {
  return `<div class="page-head">
    ${backRoute !== false ? `<button class="back-link" data-back>‹ Kembali</button>` : ""}
    <h1 class="page-title">${escapeHtml(title)}</h1>
    ${sub ? `<p class="page-sub">${escapeHtml(sub)}</p>` : ""}
  </div>`;
}

// ---------- Legacy stubs ----------
// Older page code sets a `topbar:` field built by these helpers. The web router
// ignores `topbar` (the navbar is persistent), but the helpers are still called
// when the view object is constructed, so keep harmless stubs.
function barHome() { return ""; }
function barBack() { return ""; }
function vBack() { return ""; }
function renderJumpLinks() {}
function renderTabbar() {}

/* page renderers live in pages-*.js via Routes[...] */
