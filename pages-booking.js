/* ============================================================
   SewaFest — Booking flow: calendar, cart, checkout, payment (web)
   ============================================================ */

// ---------- Booking: pick dates + qty ----------
Routes["book"] = (id) => {
  const p = getProduct(id);
  if (!p) return { body: notFound(), tab: "search" };
  State.draft = { productId: id, qty: 1, start: null, end: null, payment: State.draft.payment || "va" };
  const avail = makeAvailability(parseInt(id.replace("p", "")) || 3);

  return {
    tab: "search",
    body: `
    <div class="container container--narrow">
      ${pageHead("Pilih Tanggal Sewa", null)}
      <div class="card">
        <div class="cart-item">
          ${imgTag(p.img, p.name, "cart-item__img", p.cat, p.icon)}
          <div class="cart-item__info">
            <b>${escapeHtml(p.name)}</b>
            <small>${getVendor(p.vendor).name}</small>
            <b style="color:var(--plum-900)">${money(p.price)} <span class="muted" style="font-weight:500">/${p.unit}</span></b>
          </div>
        </div>
      </div>

      <div class="mt" id="calHost"></div>

      <div class="card mt">
        <div class="row between">
          <div><b style="font-size:15px">Jumlah</b><br><small class="muted">Qty / paket yang disewa</small></div>
          <div class="stepper" id="qtyStep">
            <button data-q="-1">−</button><span id="qtyVal">1</span><button data-q="1">+</button>
          </div>
        </div>
      </div>

      <div class="card mt" id="selSummary">
        <small class="muted">Pilih tanggal mulai & selesai pada kalender di atas.</small>
      </div>

      <div class="mt">
        <button class="btn btn--primary btn--block btn--lg" id="addBtn" disabled>Pilih tanggal dahulu</button>
      </div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => {
      renderCalendar(document.getElementById("calHost"), avail, (start, end) => {
        State.draft.start = start; State.draft.end = end;
        updateBookSummary(p);
      });
      document.getElementById("qtyStep").onclick = (e) => {
        const b = e.target.closest("[data-q]"); if (!b) return;
        State.draft.qty = Math.max(1, State.draft.qty + parseInt(b.dataset.q));
        document.getElementById("qtyVal").textContent = State.draft.qty;
        updateBookSummary(p);
      };
      document.getElementById("addBtn").onclick = () => {
        if (!State.draft.start) return;
        State.cart.push({ productId: p.id, qty: State.draft.qty, start: State.draft.start, end: State.draft.end });
        toast("Ditambahkan ke keranjang 🛒");
        go("cart");
      };
    },
  };
};

function dayDiff(a, b) { return Math.max(1, Math.round((b - a) / 86400000) + 1); }

function updateBookSummary(p) {
  const d = State.draft;
  const host = document.getElementById("selSummary");
  const btn = document.getElementById("addBtn");
  if (!d.start) {
    host.innerHTML = `<small class="muted">Pilih tanggal mulai & selesai pada kalender di atas.</small>`;
    btn.disabled = true; btn.textContent = "Pilih tanggal dahulu";
    return;
  }
  const end = d.end || d.start;
  const days = dayDiff(d.start, end);
  const unitTotal = p.unit === "hari" ? p.price * days : p.price;
  const total = unitTotal * d.qty;
  const fmt = (dt) => `${dt.getDate()} ${MONTHS[dt.getMonth()].slice(0,3)} ${dt.getFullYear()}`;
  host.innerHTML = `
    <div class="summary-line"><span>Tanggal</span><span>${fmt(d.start)}${d.end && +d.end !== +d.start ? " – " + fmt(end) : ""}</span></div>
    <div class="summary-line"><span>Durasi</span><span>${p.unit === "hari" ? days + " hari" : "1 paket"}</span></div>
    <div class="summary-line"><span>Jumlah</span><span>${d.qty}×</span></div>
    <div class="summary-line total"><span>Perkiraan Total</span><span>${money(total)}</span></div>`;
  btn.disabled = false; btn.textContent = "Tambah ke Keranjang · " + money(total);
}

// ---------- Reusable availability calendar ----------
function renderCalendar(host, avail, onPick) {
  let month = State.calMonth, year = State.calYear;
  let sel = { start: null, end: null };

  function draw() {
    const first = new Date(year, month, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(2026, 9, 4);

    let cells = "";
    for (let i = 0; i < startDow; i++) cells += `<div class="cal__cell empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const status = avail[d] || "available";
      let cls = "cal__cell ";
      if (isPast) cls += "past"; else cls += status;
      const inSel = sel.start && sel.end && date >= sel.start && date <= sel.end;
      const isEdge = (sel.start && +date === +sel.start) || (sel.end && +date === +sel.end);
      if (inSel && !isEdge) cls += " in-range";
      if (isEdge) cls += " selected";
      const clickable = !isPast && status !== "booked";
      cells += `<div class="${cls}" ${clickable ? `data-day="${d}"` : ""}>${d}</div>`;
    }

    host.innerHTML = `
      <div class="cal">
        <div class="cal__head">
          <b>${MONTHS[month]} ${year}</b>
          <div class="cal__nav">
            <button class="navbtn" data-nav="-1">‹</button>
            <button class="navbtn" data-nav="1">›</button>
          </div>
        </div>
        <div class="cal__grid">
          ${DOW.map(d => `<div class="cal__dow">${d}</div>`).join("")}
          ${cells}
        </div>
        <div class="cal__legend">
          <span><i class="dot d-av"></i> Tersedia</span>
          <span><i class="dot d-li"></i> Terbatas</span>
          <span><i class="dot d-bk"></i> Penuh</span>
        </div>
      </div>`;

    host.querySelector(".cal__grid").onclick = (e) => {
      const c = e.target.closest("[data-day]"); if (!c) return;
      const d = parseInt(c.dataset.day);
      const date = new Date(year, month, d);
      if (!sel.start || (sel.start && sel.end)) { sel.start = date; sel.end = null; }
      else { if (date < sel.start) { sel.end = sel.start; sel.start = date; } else sel.end = date; }
      draw();
      if (onPick) onPick(sel.start, sel.end);
    };
    host.querySelectorAll("[data-nav]").forEach(b => b.onclick = () => {
      month += parseInt(b.dataset.nav);
      if (month < 0) { month = 11; year--; } if (month > 11) { month = 0; year++; }
      draw();
    });
  }
  draw();
}

// ---------- Cart ----------
Routes["cart"] = () => {
  if (!State.cart.length) {
    return { tab: "search", body: `<div class="container">${pageHead("Keranjang", null)}
      <div class="empty"><div class="big">🛒</div><b>Keranjang masih kosong</b>Yuk cari perlengkapan untuk pestamu!
      <br><button class="btn btn--primary btn--sm mt" data-go="search">Jelajahi Produk</button></div></div>` };
  }
  const lines = State.cart.map((item, idx) => {
    const p = getProduct(item.productId);
    const end = item.end || item.start;
    const days = p.unit === "hari" ? dayDiff(item.start, end) : 1;
    const sub = (p.unit === "hari" ? p.price * days : p.price) * item.qty;
    const fmt = (dt) => `${dt.getDate()}/${dt.getMonth()+1}`;
    return { p, item, idx, days, sub, label: `${fmt(item.start)}${+end !== +item.start ? "–" + fmt(end) : ""}` };
  });
  const subtotal = lines.reduce((s, l) => s + l.sub, 0);
  const fee = Math.round(subtotal * 0.02);
  const total = subtotal + fee;

  return {
    tab: "search",
    body: `
    <div class="container container--narrow">
      ${pageHead("Keranjang", `${lines.length} item siap disewa`)}
      <div class="stack">
        ${lines.map(l => `
          <div class="card">
            <div class="cart-item">
              ${imgTag(l.p.img, l.p.name, "cart-item__img", l.p.cat, l.p.icon)}
              <div class="cart-item__info">
                <b>${escapeHtml(l.p.name)}</b>
                <small>📅 ${l.label} · ${l.days > 1 ? l.days + " hari · " : ""}${l.item.qty}×</small>
                <small>${getVendor(l.p.vendor).name}</small>
                <b style="color:var(--plum-900)">${money(l.sub)}</b>
              </div>
              <button class="btn btn--ghost btn--sm" data-del="${l.idx}" title="Hapus">🗑️ Hapus</button>
            </div>
          </div>`).join("")}
      </div>

      <div class="card mt">
        <div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="summary-line"><span>Biaya layanan (2%)</span><span>${money(fee)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${money(total)}</span></div>
      </div>

      <div class="note mt">🔒 Pembayaran aman & tercatat. Deposit (jika ada) dikembalikan setelah barang kembali.</div>

      <div class="mt">
        <button class="btn btn--primary btn--block btn--lg" data-go="checkout">Lanjut ke Checkout · ${money(total)}</button>
      </div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => {
      $screen.querySelectorAll("[data-del]").forEach(b => b.onclick = (e) => {
        e.stopPropagation();
        State.cart.splice(parseInt(b.dataset.del), 1);
        toast("Item dihapus"); render();
      });
    },
  };
};

// ---------- Checkout ----------
Routes["checkout"] = () => {
  if (!State.cart.length) return { body: notFound(), tab: "search" };
  const subtotal = State.cart.reduce((s, item) => {
    const p = getProduct(item.productId);
    const end = item.end || item.start;
    const days = p.unit === "hari" ? dayDiff(item.start, end) : 1;
    return s + (p.unit === "hari" ? p.price * days : p.price) * item.qty;
  }, 0);
  const fee = Math.round(subtotal * 0.02);
  const total = subtotal + fee;
  const pays = [
    ["va", "🏦", "Virtual Account", "BCA, Mandiri, BNI, BRI"],
    ["gopay", "🟢", "GoPay", "Saldo & PayLater"],
    ["qris", "📱", "QRIS", "Scan dari semua e-wallet"],
  ];
  return {
    tab: "search",
    body: `
    <div class="container">
      ${pageHead("Checkout", null)}
      <div class="detail" style="grid-template-columns:1.3fr 0.7fr">
        <div>
          <b style="font-size:15px">📍 Alamat Pengiriman</b>
          <div class="card mt-s">
            <div class="field"><label>Nama Penerima</label><input id="coName" value="Sari Rahayu" /></div>
            <div class="field"><label>No. HP</label><input id="coPhone" value="0812-3456-7890" /></div>
            <div class="field" style="margin-bottom:0"><label>Alamat Lengkap Acara</label><textarea id="coAddr">Jl. Kemakmuran No. 12, RT 03/RW 05, Bekasi Timur</textarea></div>
          </div>

          <b style="font-size:15px;display:block;margin-top:22px">💳 Metode Pembayaran</b>
          <div class="stack mt-s" id="payOpts">
            ${pays.map(([id, ic, name, sub]) => `
              <div class="pay-opt ${State.draft.payment === id ? "is-active" : ""}" data-pay="${id}">
                <span class="pay-ic">${ic}</span>
                <div class="pay-name"><b>${name}</b><small>${sub}</small></div>
                <span class="radio"></span>
              </div>`).join("")}
          </div>
        </div>

        <div>
          <div class="card" style="position:sticky;top:calc(var(--nav-h) + 20px)">
            <b style="font-size:15px">Ringkasan</b>
            <div class="mt-s">
              <div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
              <div class="summary-line"><span>Biaya layanan</span><span>${money(fee)}</span></div>
              <div class="summary-line total"><span>Total Bayar</span><span>${money(total)}</span></div>
            </div>
            <button class="btn btn--primary btn--block btn--lg mt" id="payNow">Bayar ${money(total)}</button>
          </div>
        </div>
      </div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => {
      document.getElementById("payOpts").onclick = (e) => {
        const o = e.target.closest("[data-pay]"); if (!o) return;
        State.draft.payment = o.dataset.pay;
        document.querySelectorAll("#payOpts .pay-opt").forEach(x => x.classList.toggle("is-active", x === o));
      };
      document.getElementById("payNow").onclick = () => {
        State._lastTotal = total;
        go("payment/" + State.draft.payment);
      };
    },
  };
};

// ---------- Payment status ----------
Routes["payment"] = (method) => {
  const total = State._lastTotal || 0;
  const methodName = { va: "Virtual Account", gopay: "GoPay", qris: "QRIS" }[method] || "Virtual Account";
  return {
    tab: "search",
    body: `<div class="container"><div class="card mt" id="payHost"></div></div>`,
    after: () => drawWaiting(document.getElementById("payHost"), method, methodName, total),
  };
};

function drawWaiting(host, method, methodName, total) {
  const vaNum = "8808 2214 " + Math.floor(1000 + Math.random() * 8999);
  host.innerHTML = `
    <div class="pay-status">
      <div class="status-ic wait">⏳</div>
      <h2>Menunggu Pembayaran</h2>
      <p>Selesaikan dalam <span class="countdown" id="cd">14:59</span></p>
      <p class="muted">Metode: <b>${methodName}</b></p>
      ${method === "qris" ? `<div class="qris"></div><p class="muted">Scan QR dengan aplikasi e-wallet kamu</p>`
        : `<div class="va-box"><div style="text-align:left"><small class="muted">Nomor ${methodName}</small><br><b>${vaNum}</b></div><button class="btn btn--ghost btn--sm" id="copyVa">Salin</button></div>`}
      <div class="va-box" style="border-style:solid;border-color:var(--line);background:#fff">
        <span class="muted">Total Tagihan</span><b style="color:var(--magenta)">${money(total)}</b>
      </div>
      <div class="row mt" style="gap:12px;justify-content:center">
        <button class="btn btn--primary btn--lg" id="simPay">✓ Simulasikan Berhasil</button>
        <button class="btn btn--ghost btn--lg" id="simCancel">Batalkan</button>
      </div>
    </div>`;

  let secs = 15 * 60;
  const cd = host.querySelector("#cd");
  clearInterval(host._t);
  host._t = setInterval(() => {
    secs--; if (secs < 0) { clearInterval(host._t); return; }
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    if (cd) cd.textContent = `${m}:${s}`;
  }, 1000);

  const copy = host.querySelector("#copyVa");
  if (copy) copy.onclick = () => toast("Nomor VA disalin 📋");
  host.querySelector("#simPay").onclick = () => { clearInterval(host._t); drawSuccess(host, total); };
  host.querySelector("#simCancel").onclick = () => { clearInterval(host._t); drawCancel(host); };
}

function drawSuccess(host, total) {
  State.cart = [];
  const orderId = "SWF-" + Math.floor(240000 + Math.random() * 9999);
  host.innerHTML = `
    <div class="pay-status">
      <div class="status-ic ok">✅</div>
      <h2>Pembayaran Berhasil!</h2>
      <p>Pesanan <b>${orderId}</b> sedang diteruskan ke vendor.</p>
      <p class="muted">Total dibayar: <b>${money(total)}</b></p>
      <div class="note" style="text-align:left;margin-top:20px">🎉 Vendor akan segera mengonfirmasi & menyiapkan barang. Pantau statusnya di <b>Riwayat Pesanan</b>.</div>
      <div class="row mt" style="gap:12px;justify-content:center">
        <button class="btn btn--primary btn--lg" data-go="orders">Lihat Pesanan Saya</button>
        <button class="btn btn--ghost btn--lg" data-go="home">Ke Beranda</button>
      </div>
    </div>`;
}

function drawCancel(host) {
  host.innerHTML = `
    <div class="pay-status">
      <div class="status-ic cancel">✕</div>
      <h2>Pembayaran Dibatalkan</h2>
      <p class="muted">Pesanan kamu dibatalkan dan tidak ada biaya yang ditagih.</p>
      <div class="row mt" style="gap:12px;justify-content:center">
        <button class="btn btn--primary btn--lg" data-go="cart">Kembali ke Keranjang</button>
        <button class="btn btn--ghost btn--lg" data-go="home">Ke Beranda</button>
      </div>
    </div>`;
}
