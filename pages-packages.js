/* ============================================================
   SewaFest — Paket EO (SewaFest as Event Organizer, "terima jadi")
   ============================================================ */

// ---------- Package card ----------
function packageCard(pkg) {
  return `<article class="pkg-card" data-go="package/${pkg.id}">
    <div class="pkg-card__img">
      ${imgTag(pkg.img, pkg.name, "pkg-card__photo", "dekor", pkg.icon)}
      ${pkg.badge ? `<span class="pkg-card__badge">${pkg.badge}</span>` : ""}
      <span class="pkg-card__eo">🎯 Diurus SewaFest</span>
    </div>
    <div class="pkg-card__body">
      <h3>${pkg.icon} ${escapeHtml(pkg.name)}</h3>
      <p class="muted">${escapeHtml(pkg.tagline)}</p>
      <div class="pkg-card__meta">
        <span>👥 ${pkg.guests}</span><span>⏱️ ${pkg.duration}</span>
      </div>
      <div class="pkg-card__foot">
        <div><small class="muted">${pkg.priceNote}</small><br><b>${money(pkg.price)}</b></div>
        <span class="btn btn--primary btn--sm">Lihat Paket →</span>
      </div>
    </div>
  </article>`;
}

// ---------- Packages listing ----------
Routes["packages"] = () => ({
  tab: "packages",
  body: `
  <div class="container">
    <section class="hero" style="min-height:300px;margin-top:28px">
      ${imgTag(CTA_IMG, "Paket EO", "hero__bg", "panggung", "🎊")}
      <div class="hero__overlay"></div>
      <div class="hero__content">
        <div class="eyebrow">Baru · Terima Jadi</div>
        <h1>Serahkan semuanya ke SewaFest</h1>
        <p>Tak perlu pusing cari vendor satu per satu. Pilih paket acara, dan <b>SewaFest yang mengurus</b> dekorasi, katering, sound, hingga setup — kamu tinggal datang & rayakan.</p>
        <div class="hero__cta">
          <button class="btn btn--gold btn--lg" data-go="eo-request">Konsultasi Gratis →</button>
        </div>
      </div>
    </section>

    <div class="eo-steps">
      <div class="eo-step"><div class="eo-step__n">1</div><b>Pilih paket / isi brief</b><small>Tentukan jenis acara, tanggal, jumlah tamu & budget.</small></div>
      <div class="eo-step"><div class="eo-step__n">2</div><b>SewaFest atur semua</b><small>Kami koordinasi vendor, katering, dekor, sound untukmu.</small></div>
      <div class="eo-step"><div class="eo-step__n">3</div><b>Setup oleh tim kami</b><small>Tim SewaFest datang, pasang, dan siapkan acara.</small></div>
      <div class="eo-step"><div class="eo-step__n">4</div><b>Terima jadi 🎉</b><small>Kamu tinggal hadir & menikmati acaranya.</small></div>
    </div>

    <div class="section-head" style="margin-top:36px"><h2>Paket Acara Siap Pakai</h2><a data-go="eo-request">Butuh custom? Konsultasi →</a></div>
    <div class="pkg-grid">
      ${PACKAGES.map(packageCard).join("")}
    </div>

    <div class="card mt" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:space-between">
      <div>
        <b style="font-size:17px">Acara kamu beda dari paket di atas?</b>
        <p class="muted mt-s">Ceritakan kebutuhanmu, tim SewaFest akan menyusun paket khusus & RAB gratis.</p>
      </div>
      <button class="btn btn--primary btn--lg" data-go="eo-request">Minta Dibuatkan Paket</button>
    </div>
    <div style="height:30px"></div>
  </div>
  `,
});

// ---------- Package detail ----------
Routes["package"] = (id) => {
  const pkg = getPackage(id);
  if (!pkg) return { body: notFound(), tab: "packages" };
  return {
    tab: "packages",
    body: `
    <div class="container">
      ${pageHead("Paket EO", null)}
      <div class="detail detail--split">
        <div class="detail__gallery">
          ${imgTag(pkg.img, pkg.name, "detail__main-img", "dekor", pkg.icon)}
          <div class="eo-badges mt">
            <span class="tag tag--mint">🎯 Diselenggarakan SewaFest</span>
            <span class="tag tag--plum">👥 ${pkg.guests}</span>
            <span class="tag tag--plum">⏱️ ${pkg.duration}</span>
          </div>
        </div>

        <div>
          ${pkg.badge ? `<span class="tag tag--gold mb" style="display:inline-flex">${pkg.badge}</span>` : ""}
          <h1 style="font-family:var(--font-display);font-size:28px;line-height:1.2">${pkg.icon} ${escapeHtml(pkg.name)}</h1>
          <p class="muted mt-s">${escapeHtml(pkg.tagline)}</p>
          <div class="price-big mt">${money(pkg.price)} <span>${pkg.priceNote}</span></div>

          <div class="card mt">
            <b style="font-size:15px">✨ Sudah termasuk</b>
            <div class="eo-incl mt-s">
              ${pkg.includes.map(([ic, t]) => `<div class="eo-incl__item"><span class="eo-incl__ic">${ic}</span><span>${escapeHtml(t)}</span></div>`).join("")}
            </div>
          </div>

          <div class="card">
            <b style="font-size:15px">📋 Cara kerjanya</b>
            <div class="stack mt-s" style="gap:0">
              ${pkg.timeline.map((step, i) => `
                <div class="row" style="gap:12px;padding:9px 0">
                  <div style="width:24px;height:24px;border-radius:999px;flex:0 0 auto;display:grid;place-items:center;font-size:12px;background:var(--grad-brand);color:#fff">${i+1}</div>
                  <span>${escapeHtml(step)}</span>
                </div>`).join("")}
            </div>
          </div>

          <div class="note">💡 Harga final menyesuaikan jumlah tamu, lokasi, dan permintaan khusus. Konsultasi & RAB <b>gratis</b> sebelum kamu membayar.</div>

          <div class="row mt" style="gap:12px">
            <button class="btn btn--primary btn--lg" style="flex:1" data-go="eo-request/${pkg.id}">Pesan Paket Ini</button>
            <button class="btn btn--ghost btn--lg" data-go="chats">💬 Tanya Dulu</button>
          </div>
        </div>
      </div>
      <div style="height:30px"></div>
    </div>
    `,
  };
};

// ---------- EO request / brief form ("terima jadi") ----------
Routes["eo-request"] = (preselect) => {
  const pkg = preselect ? getPackage(preselect) : null;
  return {
    tab: "packages",
    body: `
    <div class="container container--narrow">
      ${pageHead("Konsultasi & Pesan Paket EO", "Ceritakan acaramu — tim SewaFest akan menyusun & mengurus semuanya")}
      <div class="card">
        ${pkg ? `<div class="note mb">Paket dipilih: <b>${pkg.icon} ${escapeHtml(pkg.name)}</b> · mulai ${money(pkg.price)}</div>` : ""}
        <div class="field">
          <label>Jenis Acara</label>
          <select id="eoType">
            <option ${pkg && pkg.id==="pkg-ultah"?"selected":""}>Ulang Tahun Anak</option>
            <option ${pkg && pkg.id==="pkg-lamaran"?"selected":""}>Lamaran / Engagement</option>
            <option ${pkg && pkg.id==="pkg-7bulanan"?"selected":""}>7 Bulanan / Aqiqah</option>
            <option ${pkg && pkg.id==="pkg-gathering"?"selected":""}>Gathering / Corporate</option>
            <option>Pernikahan</option>
            <option>Lainnya</option>
          </select>
        </div>
        <div class="row" style="gap:14px;align-items:flex-start">
          <div class="field" style="flex:1"><label>Tanggal Acara</label><input id="eoDate" type="text" placeholder="mis. 20 Desember 2026" /></div>
          <div class="field" style="flex:1"><label>Perkiraan Jumlah Tamu</label><input id="eoGuests" type="number" placeholder="mis. 50" /></div>
        </div>
        <div class="row" style="gap:14px;align-items:flex-start">
          <div class="field" style="flex:1"><label>Perkiraan Budget</label>
            <select id="eoBudget">
              <option>< Rp 5 juta</option>
              <option>Rp 5 – 10 juta</option>
              <option>Rp 10 – 20 juta</option>
              <option>> Rp 20 juta</option>
              <option>Belum tahu / minta saran</option>
            </select>
          </div>
          <div class="field" style="flex:1"><label>Lokasi / Area</label><input id="eoVenue" placeholder="mis. rumah, gedung, area Bekasi Timur" /></div>
        </div>
        <div class="field" style="margin-bottom:0"><label>Kebutuhan Khusus (opsional)</label>
          <textarea id="eoNotes" placeholder="mis. tema warna pastel, ada menu vegetarian, butuh MC, dll."></textarea></div>
      </div>

      <div class="note mt">🛡️ <b>Aman:</b> Konsultasi & penyusunan rencana gratis. Kamu baru membayar setelah menyetujui proposal & RAB dari SewaFest.</div>

      <div class="mt">
        <button class="btn btn--primary btn--block btn--lg" id="eoSubmit">Kirim & Minta Dihubungi</button>
      </div>
      <div style="height:30px"></div>
    </div>
    `,
    after: () => {
      document.getElementById("eoSubmit").onclick = () => {
        toast("Terkirim! Tim EO SewaFest akan menghubungimu < 1×24 jam 🎉");
        setTimeout(() => go("packages"), 900);
      };
    },
  };
};
