/* ============================================================
   SewaFest — Customer pages (web-first)
   ============================================================ */

// ---------- Splash ----------
Routes["splash"] = () => ({
  tab: null,
  body: `<div class="splash">
    <div class="confetti">🎉🎈✨🎊🎉🎈✨🎊🎉🎈✨🎊🎉🎈✨🎊🎉🎈✨🎊</div>
    <div class="logo-mark">SewaFest</div>
    <p class="tagline">"Rayakan Lebih Bijak, Sewa Lebih Mudah"</p>
    <div class="splash__cta">
      <button class="btn btn--gold btn--lg" data-go="home">Masuk ke Platform</button>
      <button class="btn btn--ghost btn--lg" style="background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.4);color:#fff" data-go="login">Login</button>
    </div>
  </div>`,
});

// ---------- Login ----------
Routes["login"] = () => ({
  tab: null,
  body: `<div class="auth-wrap">
    <div class="auth-side">
      ${imgTag(HERO_IMG, "Pesta", "", "dekor", "🎉")}
      <div class="as-content">
        <div class="logo-mark">SewaFest</div>
        <p class="tagline">"Rayakan Lebih Bijak, Sewa Lebih Mudah"</p>
        <ul>
          <li>✓ Semua vendor Bekasi dalam satu platform</li>
          <li>✓ Harga & ketersediaan transparan real-time</li>
          <li>✓ Pembayaran aman: VA, GoPay, QRIS</li>
          <li>✓ Rating & ulasan asli dari penyewa lain</li>
        </ul>
      </div>
    </div>
    <div class="auth-form">
      <div class="auth-form__inner">
        <h2>Masuk</h2>
        <p class="sub">Selamat datang kembali di SewaFest 👋</p>
        <div class="field"><label>Email / No. HP</label><input value="sari@email.com" /></div>
        <div class="field"><label>Kata Sandi</label><input type="password" value="••••••••" /></div>
        <button class="btn btn--primary btn--block" data-go="home">Masuk</button>
        <div class="divider">atau</div>
        <div class="social">
          <button class="btn btn--ghost" data-go="home">Google</button>
          <button class="btn btn--ghost" data-go="home">Apple</button>
        </div>
        <p class="alt">Belum punya akun? <a data-go="signup">Daftar</a></p>
        <div class="note" style="margin-top:20px">Prototype — klik <b>Masuk</b> dengan data apa pun untuk lanjut.</div>
      </div>
    </div>
  </div>`,
});

// ---------- Signup ----------
Routes["signup"] = () => ({
  tab: null,
  body: `<div class="auth-wrap">
    <div class="auth-side">
      ${imgTag(CTA_IMG, "Acara", "", "panggung", "🎊")}
      <div class="as-content">
        <div class="logo-mark">SewaFest</div>
        <p class="tagline">Mulai sewa untuk pestamu hari ini</p>
        <ul>
          <li>✓ Gratis daftar, tanpa biaya tersembunyi</li>
          <li>✓ Bandingkan ratusan produk sewa</li>
          <li>✓ Booking anti double-booking</li>
        </ul>
      </div>
    </div>
    <div class="auth-form">
      <div class="auth-form__inner">
        <h2>Daftar</h2>
        <p class="sub">Buat akun & mulai sewa untuk pestamu</p>
        <div class="field"><label>Nama Lengkap</label><input placeholder="Nama kamu" /></div>
        <div class="field"><label>Email</label><input placeholder="email@contoh.com" /></div>
        <div class="field"><label>No. HP</label><input placeholder="08xx xxxx xxxx" /></div>
        <div class="field"><label>Kata Sandi</label><input type="password" placeholder="Minimal 8 karakter" /></div>
        <button class="btn btn--primary btn--block" data-go="home">Buat Akun</button>
        <p class="alt">Sudah punya akun? <a data-go="login">Masuk</a></p>
      </div>
    </div>
  </div>`,
});

// ---------- Home ----------
Routes["home"] = () => {
  const popular = PRODUCTS.filter(p => p.tags.includes("Populer"));
  const insta = PRODUCTS.filter(p => p.tags.includes("Instagrammable"));
  return {
    tab: "home",
    body: `
    <div class="container">
      <section class="hero">
        ${imgTag(HERO_IMG, "Pesta meriah", "hero__bg", "dekor", "🎉")}
        <div class="hero__overlay"></div>
        <div class="hero__content">
          <div class="eyebrow">Marketplace Sewa · Bekasi</div>
          <h1>Semua kebutuhan pestamu, satu platform</h1>
          <p>Tenda, sound system, dekorasi, katering — bandingkan harga & cek ketersediaan real-time dari vendor UMKM terpercaya di Bekasi.</p>
          <div class="hero__cta">
            <button class="btn btn--gold btn--lg" data-go="search">Jelajahi Produk →</button>
            <button class="btn btn--ghost btn--lg" style="background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.45);color:#fff" data-go="v-home">Saya Vendor</button>
          </div>
        </div>
      </section>

      <div class="stat-strip">
        <div class="stat"><b>100+</b><span>Vendor UMKM</span></div>
        <div class="stat"><b>4.8★</b><span>Rating rata-rata</span></div>
        <div class="stat"><b>12</b><span>Kategori produk</span></div>
        <div class="stat"><b>Real-time</b><span>Cek ketersediaan</span></div>
      </div>
    </div>

    <div class="container section--tight">
      <div class="section-head"><h2>Kategori</h2><a data-go="search">Lihat semua</a></div>
      <div class="cat-grid">
        ${CATEGORIES.map(c => `<div class="cat" data-go="search/${c.id}">
          ${imgTag(c.img, c.name, "cat__img", c.id, c.icon)}
          <span>${c.icon} ${c.name}</span>
        </div>`).join("")}
      </div>
    </div>

    <div class="container section--tight">
      <div class="section-head"><h2>🔥 Paling Dicari</h2><a data-go="search">Semua produk</a></div>
      <div class="prod-grid">${popular.map(p => productCard(p)).join("")}</div>
    </div>

    <div class="container section--tight">
      <div class="section-head"><h2>📸 Instagrammable</h2><a data-go="search">Semua produk</a></div>
      <div class="prod-grid">${insta.map(p => productCard(p)).join("")}</div>
    </div>

    <div class="container section--tight">
      <section class="hero" style="min-height:260px">
        ${imgTag(CTA_IMG, "Ajakan", "hero__bg", "panggung", "🎊")}
        <div class="hero__overlay"></div>
        <div class="hero__content">
          <h1 style="font-size:32px">Punya usaha sewa perlengkapan?</h1>
          <p>Go-digital bersama SewaFest. Kelola stok, kalender, dan pantau pendapatan dalam satu dashboard.</p>
          <button class="btn btn--gold" data-go="v-home">Buka Dashboard Vendor →</button>
        </div>
      </section>
    </div>
    `,
  };
};

// ---------- Search / Marketplace ----------
let searchFilter = { cat: "all", q: "", sort: "pop" };

Routes["search"] = (param) => {
  if (param) searchFilter.cat = param;
  return {
    tab: "search",
    body: `
    <div class="container">
      ${pageHead("Marketplace", "Temukan perlengkapan acara dari vendor terpercaya di Bekasi", false)}
      <div class="card" style="padding:16px">
        <div class="row between wrap" style="gap:14px">
          <div class="chips" id="catChips">
            <div class="chip ${searchFilter.cat === "all" ? "is-active" : ""}" data-cat="all">Semua</div>
            ${CATEGORIES.map(c => `<div class="chip ${searchFilter.cat === c.id ? "is-active" : ""}" data-cat="${c.id}">${c.icon} ${c.name}</div>`).join("")}
          </div>
          <select class="select" id="sortSel">
            <option value="pop">Terpopuler</option>
            <option value="low">Harga Termurah</option>
            <option value="high">Harga Tertinggi</option>
            <option value="rate">Rating Tertinggi</option>
          </select>
        </div>
      </div>
      <p class="muted mt" id="resultCount" style="margin:16px 0 10px"></p>
      <div class="prod-grid" id="results"></div>
      <div style="height:30px"></div>
    </div>
    `,
    after: () => {
      const sortSel = document.getElementById("sortSel");
      sortSel.value = searchFilter.sort;
      const draw = () => {
        let list = PRODUCTS.filter(p => searchFilter.cat === "all" || p.cat === searchFilter.cat);
        if (searchFilter.q.trim()) {
          const q = searchFilter.q.toLowerCase();
          list = list.filter(p => p.name.toLowerCase().includes(q) || getVendor(p.vendor).name.toLowerCase().includes(q));
        }
        if (searchFilter.sort === "low") list.sort((a, b) => a.price - b.price);
        else if (searchFilter.sort === "high") list.sort((a, b) => b.price - a.price);
        else if (searchFilter.sort === "rate") list.sort((a, b) => b.rating - a.rating);
        else list.sort((a, b) => b.booked - a.booked);
        const q = searchFilter.q.trim();
        document.getElementById("resultCount").textContent =
          `${list.length} produk${q ? ` untuk "${q}"` : ""}${searchFilter.cat !== "all" ? " · " + (CATEGORIES.find(c=>c.id===searchFilter.cat)||{}).name : ""}`;
        const box = document.getElementById("results");
        box.innerHTML = list.length ? list.map(p => productCard(p)).join("")
          : `<div class="empty" style="grid-column:1/-1"><div class="big">🔍</div><b>Tidak ada hasil</b>Coba kata kunci atau kategori lain.</div>`;
      };
      sortSel.onchange = () => { searchFilter.sort = sortSel.value; draw(); };
      document.getElementById("catChips").onclick = (e) => {
        const c = e.target.closest("[data-cat]"); if (!c) return;
        searchFilter.cat = c.dataset.cat;
        document.querySelectorAll("#catChips .chip").forEach(x => x.classList.toggle("is-active", x === c));
        draw();
      };
      // react to global navbar search live
      if ($globalSearch) $globalSearch.oninput = () => { searchFilter.q = $globalSearch.value; draw(); };
      draw();
    },
  };
};

// ---------- Product detail ----------
Routes["product"] = (id) => {
  const p = getProduct(id);
  if (!p) return { body: notFound(), tab: "search" };
  const v = getVendor(p.vendor);
  const revs = REVIEWS[p.id] || [];
  const fav = State.favorites.has(p.id) ? "💜 Favorit" : "🤍 Simpan";
  // thumbnails: product + its vendor cover + category image
  const thumbs = [p.img, v.cover, (CATEGORIES.find(c => c.id === p.cat) || {}).img].filter(Boolean);
  return {
    tab: "search",
    body: `
    <div class="container">
      ${pageHead("Detail Produk", null)}
      <div class="detail">
        <div class="detail__gallery">
          ${imgTag(p.img, p.name, "detail__main-img", p.cat, p.icon).replace("detail__main-img", "detail__main-img").replace("<img ", `<img id="mainImg" `)}
          <div class="detail__thumbs" id="thumbs">
            ${thumbs.map((t, i) => `<img src="${t}" class="${i===0?"sel":""}" data-src="${t}" alt="thumb" onerror="this.style.display='none'" />`).join("")}
          </div>
        </div>

        <div>
          <div class="pill-row mb">
            ${p.tags.map(t => `<span class="tag tag--plum">${t}</span>`).join("")}
            <span class="rate">★ ${p.rating} <span class="muted" style="font-weight:500">(${p.reviews} ulasan)</span></span>
            <span class="muted" style="font-size:13px">· ${p.booked}× disewa</span>
          </div>
          <h1 style="font-family:var(--font-display);font-size:28px;line-height:1.2">${escapeHtml(p.name)}</h1>
          <div class="price-big mt-s">${money(p.price)} <span>/ ${p.unit}</span></div>

          <div class="card mt" data-go="vendor/${v.id}" style="cursor:pointer">
            <div class="vrow">
              ${imgTag(v.logo, v.name, "vlogo", p.cat, v.icon)}
              <div class="vinfo">
                <b>${escapeHtml(v.name)} ${v.verified ? '<span class="verified">✓ Terverifikasi</span>' : ""}</b>
                <small>📍 ${v.area} · ★ ${v.rating} · Respon ~${v.responseMin} mnt</small>
              </div>
              <span style="color:var(--ink-soft)">›</span>
            </div>
          </div>

          <div class="row mt" style="gap:12px">
            <button class="btn btn--primary btn--lg" style="flex:1" data-go="book/${p.id}">Sewa Sekarang</button>
            <button class="btn btn--ghost btn--lg" data-fav="${p.id}">${fav}</button>
            <button class="btn btn--ghost btn--lg" data-go="chats">💬</button>
          </div>

          <div class="card mt">
            <b style="font-size:15px">Deskripsi</b>
            <p class="muted mt-s">${escapeHtml(p.desc)}</p>
          </div>

          <div class="card">
            <b style="font-size:15px">Spesifikasi</b>
            <div class="spec-list mt-s">
              ${p.specs.map(([k, val]) => `<div class="spec"><span>${escapeHtml(k)}</span><span>${escapeHtml(val)}</span></div>`).join("")}
            </div>
          </div>

          <div class="card">
            <div class="row between">
              <b style="font-size:15px">Ketersediaan</b>
              <span class="muted" style="font-size:13px">Pilih tanggal saat booking</span>
            </div>
            <div class="cal__legend mt-s">
              <span><i class="dot d-av"></i> Tersedia</span>
              <span><i class="dot d-li"></i> Terbatas</span>
              <span><i class="dot d-bk"></i> Penuh</span>
            </div>
            <p class="muted mt-s" style="font-size:13px">Vendor memperbarui stok & jadwal real-time untuk mencegah double booking.</p>
          </div>
        </div>
      </div>

      <div class="section--tight">
        <div class="section-head"><h2>Ulasan (${revs.length})</h2></div>
        <div class="card">
          ${revs.length ? revs.map(reviewHtml).join("") : '<p class="muted">Belum ada ulasan.</p>'}
        </div>
      </div>
    </div>
    `,
    after: () => {
      const thumbsEl = document.getElementById("thumbs");
      const main = document.getElementById("mainImg");
      if (thumbsEl && main) thumbsEl.onclick = (e) => {
        const t = e.target.closest("[data-src]"); if (!t) return;
        main.src = t.dataset.src;
        thumbsEl.querySelectorAll("img").forEach(x => x.classList.toggle("sel", x === t));
      };
    },
  };
};

function reviewHtml(r) {
  return `<div class="review">
    <div class="review__top">
      <div class="review__av">${r.initial}</div>
      <div><b>${escapeHtml(r.user)}</b><br><small>${r.date}</small></div>
    </div>
    <div class="review__stars">${stars(r.stars)}</div>
    <p>${escapeHtml(r.text)}</p>
    ${r.photos.length ? `<div class="review__photos">${r.photos.map(() => '<span>🖼️</span>').join("")}</div>` : ""}
  </div>`;
}

// ---------- Vendor profile ----------
Routes["vendor"] = (id) => {
  const v = getVendor(id);
  if (!v) return { body: notFound(), tab: "search" };
  const items = PRODUCTS.filter(p => p.vendor === id);
  return {
    tab: "search",
    body: `
    <div class="container">
      <div class="vendor-cover">${imgTag(v.cover, v.name, "", "lainnya", v.icon)}</div>
      <div class="vendor-head">
        ${imgTag(v.logo, v.name, "vlogo", "lainnya", v.icon)}
        <div class="vmeta">
          <h1>${escapeHtml(v.name)} ${v.verified ? '<span class="verified" style="font-size:16px">✓</span>' : ""}</h1>
          <div class="vsub">📍 ${v.area} · Sejak ${v.since}</div>
          <div class="pill-row mt-s">${v.badges.map(b => `<span class="tag tag--plum">${b}</span>`).join("")}</div>
        </div>
      </div>

      <div class="vstats">
        <div class="vstat b-mag"><b>★ ${v.rating}</b><small>${v.reviews} ulasan</small></div>
        <div class="vstat b-plum"><b>${v.orders}+</b><small>Pesanan selesai</small></div>
        <div class="vstat b-mint"><b>~${v.responseMin}m</b><small>Waktu respon</small></div>
      </div>

      <div class="card mt">
        <b style="font-size:15px">Tentang Vendor</b>
        <p class="muted mt-s">${escapeHtml(v.bio)}</p>
        <button class="btn btn--ghost btn--sm mt" data-go="chats">💬 Chat Vendor</button>
      </div>

      <div class="section--tight">
        <div class="section-head"><h2>Portofolio Produk (${items.length})</h2></div>
        <div class="prod-grid">${items.map(p => productCard(p)).join("")}</div>
      </div>
    </div>
    `,
  };
};

// ---------- Profile / Akun ----------
Routes["profile"] = () => ({
  tab: "home",
  body: `
  <div class="container container--narrow">
    ${pageHead("Akun Saya", null, false)}
    <div class="card">
      <div class="vrow">
        <div class="vlogo" style="background:var(--grad-gold);color:#4a2600;display:grid;place-items:center;font-weight:800;font-size:22px">S</div>
        <div class="vinfo"><b>Sari Rahayu</b><small>sari@email.com · Bekasi Timur</small></div>
      </div>
    </div>
    <div class="stack mt">
      ${menuRow("🧾","Riwayat Pesanan","orders")}
      ${menuRow("💜","Favorit Saya", null, State.favorites.size + " item")}
      ${menuRow("💬","Pesan","chats")}
      ${menuRow("📍","Alamat Tersimpan")}
      ${menuRow("💳","Metode Pembayaran")}
      ${menuRow("🏪","Beralih ke Mode Vendor","v-home")}
      ${menuRow("❓","Bantuan & FAQ")}
    </div>
    <div class="mt">
      <button class="btn btn--ghost btn--block" data-go="splash">Keluar</button>
      <p class="center muted mt" style="font-size:12px">SewaFest Prototype v2.0 (Web) · Kelompok 4</p>
    </div>
    <div style="height:20px"></div>
  </div>
  `,
});

function menuRow(ic, label, route, right = "") {
  return `<div class="lrow" ${route ? `data-go="${route}"` : ""}>
    <div class="lrow__ic">${ic}</div>
    <div class="lrow__main"><b>${label}</b></div>
    <div class="lrow__right">${right ? `<small class="muted">${right}</small>` : ""} <span style="color:var(--ink-soft)">›</span></div>
  </div>`;
}

function notFound() {
  return `<div class="container"><div class="empty"><div class="big">🤔</div><b>Halaman tidak ditemukan</b><button class="btn btn--ghost btn--sm mt" data-go="home">Ke Beranda</button></div></div>`;
}
