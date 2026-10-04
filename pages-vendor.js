/* ============================================================
   SewaFest — Vendor pages (web-first)
   ============================================================ */

// ---------- Vendor dashboard ----------
Routes["v-home"] = () => {
  const v = VENDOR_ME;
  const newOrders = VENDOR_ORDERS.filter(o => o.status === "new");
  const todayIncome = VENDOR_INCOME[VENDOR_INCOME.length - 1].value;
  const prevIncome = VENDOR_INCOME[VENDOR_INCOME.length - 2].value;
  const growth = (((todayIncome - prevIncome) / prevIncome) * 100).toFixed(0);
  return {
    tab: "v-home",
    body: `
    <div class="container">
      <div class="v-hero">
        <small>Halo, ${escapeHtml(v.name)} 👋</small>
        <h2>Dashboard Bisnis Vendor</h2>
        <div class="v-metrics">
          <div class="v-metric"><b>${rupiahShort(todayIncome)}</b><span>Pendapatan Okt (+${growth}%)</span></div>
          <div class="v-metric"><b>${newOrders.length}</b><span>Pesanan baru</span></div>
          <div class="v-metric"><b>★ ${v.rating}</b><span>${v.reviews} ulasan</span></div>
          <div class="v-metric"><b>${VENDOR_INVENTORY.reduce((s,i)=>s+i.available,0)}</b><span>Stok tersedia</span></div>
        </div>
      </div>

      <div class="detail" style="grid-template-columns:1.3fr 0.7fr;margin-top:28px;align-items:start">
        <div>
          <div class="section-head"><h2 style="font-size:20px">🔔 Pesanan Baru</h2><a data-go="v-orders">Lihat semua</a></div>
          <div class="stack">
            ${newOrders.length ? newOrders.map(vendorOrderRow).join("")
              : `<div class="empty" style="padding:30px"><div class="big">✅</div><b>Tidak ada pesanan baru</b></div>`}
          </div>
        </div>
        <div>
          <div class="section-head"><h2 style="font-size:20px">📊 Pendapatan</h2><a data-go="v-insights">Detail</a></div>
          <div id="miniChart"></div>
          <div class="note mt">💡 Pendapatan Oktober naik ${growth}% dari September.</div>
        </div>
      </div>

      <div class="section--tight">
        <div class="section-head"><h2 style="font-size:20px">⚡ Akses Cepat</h2></div>
        <div class="tile-grid">
          <div class="tile" data-go="v-inventory"><div class="tile-ic">📦</div><span>Gudang</span></div>
          <div class="tile" data-go="v-calendar"><div class="tile-ic">📅</div><span>Kalender</span></div>
          <div class="tile" data-go="v-insights"><div class="tile-ic">📈</div><span>Insight</span></div>
          <div class="tile" data-go="v-chats"><div class="tile-ic">💬</div><span>Chat</span></div>
        </div>
      </div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => renderIncomeChart(document.getElementById("miniChart"), VENDOR_INCOME.slice(-4)),
  };
};

function vendorOrderRow(o) {
  const m = STATUS_META[o.status];
  return `<div class="lrow" data-go="v-order/${o.id}">
    <div class="lrow__ic">📋</div>
    <div class="lrow__main">
      <b>${escapeHtml(o.product)}</b>
      <small>${escapeHtml(o.customer)} · ${o.qty}× · 🎉 ${o.eventDate}</small>
      <small style="color:var(--plum-900);font-weight:700">${money(o.total)}</small>
    </div>
    <div class="lrow__right"><span class="status-pill ${m.pill}">${m.label}</span></div>
  </div>`;
}

// ---------- Vendor orders ----------
let vOrderTab = "all";
Routes["v-orders"] = () => ({
  tab: "v-orders",
  body: `
  <div class="container container--narrow">
    ${pageHead("Manajemen Pesanan", "Terima, tolak, dan tindaklanjuti pesanan", false)}
    <div class="chips" id="vOrderTabs">
      ${[["all","Semua"],["new","Baru"],["active","Diproses"],["done","Selesai"]]
        .map(([k,l]) => `<div class="chip ${vOrderTab===k?"is-active":""}" data-vt="${k}">${l}</div>`).join("")}
    </div>
    <div class="stack mt" id="vOrderList"></div>
    <div style="height:20px"></div>
  </div>
  `,
  after: () => {
    const draw = () => {
      let list = VENDOR_ORDERS.filter(o => vOrderTab === "all" || o.status === vOrderTab);
      const box = document.getElementById("vOrderList");
      box.innerHTML = list.length ? list.map(vendorOrderRow).join("")
        : `<div class="empty"><div class="big">📦</div><b>Tidak ada pesanan</b></div>`;
    };
    document.getElementById("vOrderTabs").onclick = (e) => {
      const c = e.target.closest("[data-vt]"); if (!c) return;
      vOrderTab = c.dataset.vt;
      document.querySelectorAll("#vOrderTabs .chip").forEach(x => x.classList.toggle("is-active", x === c));
      draw();
    };
    draw();
  },
});

// ---------- Vendor order detail ----------
Routes["v-order"] = (id) => {
  const o = VENDOR_ORDERS.find(x => x.id === id);
  if (!o) return { body: notFound(), tab: "v-orders" };
  const m = STATUS_META[o.status];
  return {
    tab: "v-orders",
    body: `
    <div class="container container--narrow">
      ${pageHead("Detail Pesanan", o.id)}
      <div class="card">
        <div class="row between">
          <div><small class="muted">No. Pesanan</small><br><b>${o.id}</b></div>
          <span class="status-pill ${m.pill}">${m.label}</span>
        </div>
      </div>
      <div class="card">
        <b style="font-size:15px">Produk</b>
        <div class="spec-list mt-s">
          <div class="spec"><span>Item</span><span>${escapeHtml(o.product)}</span></div>
          <div class="spec"><span>Jumlah</span><span>${o.qty}×</span></div>
          <div class="spec"><span>Total</span><span style="color:var(--plum-900);font-weight:800">${money(o.total)}</span></div>
        </div>
      </div>
      <div class="card">
        <b style="font-size:15px">Penyewa</b>
        <div class="spec-list mt-s">
          <div class="spec"><span>Nama</span><span>${escapeHtml(o.customer)}</span></div>
          <div class="spec"><span>No. HP</span><span>${escapeHtml(o.phone)}</span></div>
          <div class="spec"><span>Tanggal acara</span><span>🎉 ${o.eventDate}</span></div>
          <div class="spec"><span>Alamat</span><span>${escapeHtml(o.address)}</span></div>
        </div>
        <button class="btn btn--ghost btn--sm mt" data-go="v-chats">💬 Chat Penyewa</button>
      </div>
      <div class="mt" id="vActions">
        ${o.status === "new" ? `
          <div class="row" style="gap:12px">
            <button class="btn btn--ghost" style="flex:1" id="rejectBtn">Tolak</button>
            <button class="btn btn--primary" style="flex:1" id="acceptBtn">✓ Terima Pesanan</button>
          </div>`
        : o.status === "active" ? `<button class="btn btn--gold btn--block" id="doneBtn">Tandai Selesai</button>`
        : `<div class="note">✅ Pesanan ini sudah selesai.</div>`}
      </div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => {
      const accept = document.getElementById("acceptBtn");
      const reject = document.getElementById("rejectBtn");
      const done = document.getElementById("doneBtn");
      if (accept) accept.onclick = () => { o.status = "active"; toast("Pesanan diterima ✓"); go("v-orders"); };
      if (reject) reject.onclick = () => { o.status = "cancel"; toast("Pesanan ditolak"); go("v-orders"); };
      if (done) done.onclick = () => { o.status = "done"; toast("Pesanan selesai 🎉"); go("v-orders"); };
    },
  };
};

// ---------- Vendor inventory ----------
Routes["v-inventory"] = () => ({
  tab: "v-inventory",
  body: `
  <div class="container">
    ${pageHead("Gudang / Inventaris", "Stok tersinkron dengan kalender ketersediaan", false)}
    <div class="minikpi">
      <div class="k"><b>${VENDOR_INVENTORY.length}</b><span>Jenis produk</span></div>
      <div class="k"><b>${VENDOR_INVENTORY.reduce((s,i)=>s+i.total,0)}</b><span>Total unit</span></div>
      <div class="k"><b>${VENDOR_INVENTORY.reduce((s,i)=>s+i.available,0)}</b><span>Tersedia</span></div>
    </div>
    <div class="section-head mt"><h2 style="font-size:20px">Daftar Produk</h2><button class="btn btn--ghost btn--sm" onclick="toast('Prototype: tambah produk')">＋ Tambah Produk</button></div>
    <div class="stack">
      ${VENDOR_INVENTORY.map(i => {
        const pct = Math.round((i.available / i.total) * 100);
        const low = i.available === 0;
        return `<div class="inv">
          ${imgTag(i.img, i.name, "inv__img", "lainnya", i.icon)}
          <div class="inv__main">
            <b>${escapeHtml(i.name)}</b>
            <small>${money(i.price)} / sewa</small>
            <div class="bar"><i style="width:${pct}%"></i></div>
          </div>
          <div class="inv__stock">
            <b style="color:${low ? "var(--coral)" : "var(--plum-900)"}">${i.available}/${i.total}</b><br>
            <small class="muted">${low ? "Habis" : "tersedia"}</small>
          </div>
        </div>`;
      }).join("")}
    </div>
    <div class="note mt">📦 Stok tersinkron otomatis dengan kalender ketersediaan — mencegah double booking.</div>
    <div style="height:20px"></div>
  </div>
  `,
});

// ---------- Vendor calendar ----------
Routes["v-calendar"] = () => ({
  tab: "v-calendar",
  body: `
  <div class="container">
    ${pageHead("Kalender Ketersediaan", "Klik tanggal untuk mengubah status", false)}
    <div class="detail" style="grid-template-columns:1.2fr 0.8fr;align-items:start">
      <div>
        <div class="note mb">📅 Klik tanggal: hijau (tersedia) → kuning (terbatas) → abu (penuh/libur).</div>
        <div id="vCalHost"></div>
      </div>
      <div class="card">
        <b style="font-size:15px">Pesanan Mendatang</b>
        <div class="stack mt-s">
          ${VENDOR_ORDERS.filter(o => o.status !== "done" && o.status !== "cancel").map(o => `
            <div class="row between" style="padding:10px 0;border-bottom:1px solid var(--line)">
              <div><b style="font-size:14px">${escapeHtml(o.product)}</b><br><small class="muted">${escapeHtml(o.customer)}</small></div>
              <span class="tag tag--plum">🎉 ${o.eventDate}</span>
            </div>`).join("")}
        </div>
      </div>
    </div>
    <div style="height:20px"></div>
  </div>
  `,
  after: () => renderVendorCalendar(document.getElementById("vCalHost"), makeAvailability(2)),
});

function renderVendorCalendar(host, avail) {
  let month = State.calMonth, year = State.calYear;
  const next = { available: "limited", limited: "booked", booked: "available" };
  function draw() {
    const first = new Date(year, month, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let cells = "";
    for (let i = 0; i < startDow; i++) cells += `<div class="cal__cell empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const status = avail[d] || "available";
      cells += `<div class="cal__cell ${status}" data-day="${d}">${d}</div>`;
    }
    host.innerHTML = `<div class="cal">
      <div class="cal__head"><b>${MONTHS[month]} ${year}</b>
        <div class="cal__nav"><button class="navbtn" data-nav="-1">‹</button><button class="navbtn" data-nav="1">›</button></div>
      </div>
      <div class="cal__grid">${DOW.map(d => `<div class="cal__dow">${d}</div>`).join("")}${cells}</div>
      <div class="cal__legend">
        <span><i class="dot d-av"></i> Tersedia</span>
        <span><i class="dot d-li"></i> Terbatas</span>
        <span><i class="dot d-bk"></i> Penuh / Libur</span>
      </div>
    </div>`;
    host.querySelector(".cal__grid").onclick = (e) => {
      const c = e.target.closest("[data-day]"); if (!c) return;
      const d = parseInt(c.dataset.day);
      avail[d] = next[avail[d] || "available"];
      draw();
      toast(`Tgl ${d}: ${ {available:"Tersedia",limited:"Terbatas",booked:"Penuh"}[avail[d]] }`);
    };
    host.querySelectorAll("[data-nav]").forEach(b => b.onclick = () => {
      month += parseInt(b.dataset.nav);
      if (month < 0) { month = 11; year--; } if (month > 11) { month = 0; year++; }
      draw();
    });
  }
  draw();
}

// ---------- Vendor insights ----------
Routes["v-insights"] = () => {
  const cur = VENDOR_INCOME[VENDOR_INCOME.length - 1].value;
  const prev = VENDOR_INCOME[VENDOR_INCOME.length - 2].value;
  const growth = (((cur - prev) / prev) * 100).toFixed(1);
  const avg = (VENDOR_INCOME.reduce((s, m) => s + m.value, 0) / VENDOR_INCOME.length).toFixed(1);
  return {
    tab: "v-insights",
    body: `
    <div class="container">
      ${pageHead("Insight & Pendapatan", "Perbandingan pendapatan bulan ke bulan", false)}
      <div class="minikpi">
        <div class="k"><b>${rupiahShort(cur)}</b><span>Bulan ini</span><div class="delta ${growth>=0?"up":"down"}">${growth>=0?"▲":"▼"} ${Math.abs(growth)}%</div></div>
        <div class="k"><b>${rupiahShort(avg)}</b><span>Rata-rata/bln</span></div>
        <div class="k"><b>${VENDOR_ME.orders}</b><span>Total order</span></div>
      </div>

      <div class="section-head mt"><h2 style="font-size:20px">📊 Perbandingan Pendapatan</h2></div>
      <div id="bigChart"></div>

      <div class="card mt">
        <b style="font-size:15px">Insight Bulan Ini</b>
        <div class="stack mt-s" style="gap:12px">
          <div class="row between"><span class="muted">📈 Pertumbuhan vs bulan lalu</span><b style="color:var(--mint)">+${growth}%</b></div>
          <div class="row between"><span class="muted">🏆 Produk terlaris</span><b>Tenda 6×8m</b></div>
          <div class="row between"><span class="muted">⭐ Rating rata-rata</span><b>${VENDOR_ME.rating}</b></div>
          <div class="row between"><span class="muted">⚡ Waktu respon</span><b>~${VENDOR_ME.responseMin} menit</b></div>
        </div>
      </div>
      <div class="note mt">🎯 Pendapatanmu tumbuh konsisten 4 bulan terakhir. Pertimbangkan tambah stok <b>Tenda 6×8m</b> yang sering kehabisan.</div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => renderIncomeChart(document.getElementById("bigChart"), VENDOR_INCOME, true),
  };
};

function renderIncomeChart(host, data, big = false) {
  const max = Math.max(...data.map(d => d.value));
  const bars = data.map(d => {
    const pct = Math.round((d.value / max) * 100);
    return `<div class="chart__col">
      <div class="chart__bar" data-val="${d.value} jt" style="height:0%" data-h="${pct}"></div>
      <div class="chart__month">${d.month}</div>
    </div>`;
  }).join("");
  host.innerHTML = `<div class="chart">
    ${big ? `<div class="row between"><b style="font-size:15px">Pendapatan 6 Bulan (juta Rp)</b><span class="tag tag--mint">Tren naik</span></div>` : ""}
    <div class="chart__bars">${bars}</div>
    ${big ? `<div class="chart__legend"><span><i class="dot" style="background:var(--magenta)"></i> Pendapatan bulanan</span></div>` : ""}
  </div>`;
  requestAnimationFrame(() => {
    host.querySelectorAll(".chart__bar").forEach(b => { b.style.height = b.dataset.h + "%"; });
  });
}

// ---------- Vendor chats ----------
Routes["v-chats"] = () => ({
  tab: "v-chats",
  body: `
  <div class="container container--narrow">
    ${pageHead("Pesan", "Balas pertanyaan & konfirmasi dengan penyewa", false)}
    <div class="stack">
      ${Object.entries(VENDOR_CHATS).map(([id, c]) => `
        <div class="lrow" data-go="v-chat/${id}">
          <div class="lrow__ic" style="background:var(--grad-gold);color:#4a2600;font-size:20px;font-weight:800">${c.initial}</div>
          <div class="lrow__main">
            <b>${escapeHtml(c.name)}</b>
            <small style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(c.last)}</small>
          </div>
          <div class="lrow__right"><small class="muted">${c.t}</small>${c.unread ? `<br><span class="status-pill sp-cancel" style="margin-top:4px;display:inline-block">${c.unread}</span>` : ""}</div>
        </div>`).join("")}
    </div>
    <div style="height:20px"></div>
  </div>
  `,
});

Routes["v-chat"] = (id) => {
  const c = VENDOR_CHATS[id];
  if (!c) return { body: notFound(), tab: "v-chats" };
  return {
    tab: "v-chats",
    body: `
    <div class="container container--narrow">
      ${pageHead("Chat Penyewa", null)}
      <div class="chat-wrap" style="margin-top:0">
        <div class="chat-head">
          <div style="width:44px;height:44px;border-radius:12px;background:var(--grad-gold);color:#4a2600;display:grid;place-items:center;font-weight:800">${c.initial}</div>
          <div><b>${escapeHtml(c.name)}</b><br><small>Penyewa</small></div>
        </div>
        <div class="chat-list" id="vChatList">${c.msgs.map(bubbleHtml).join("")}</div>
        <div class="chat-input"><input id="vChatMsg" placeholder="Balas pesan…" /><button class="chat-send" id="vChatSend">➤</button></div>
      </div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => {
      const list = document.getElementById("vChatList");
      const input = document.getElementById("vChatMsg");
      list.scrollTop = list.scrollHeight;
      const send = () => {
        const txt = input.value.trim(); if (!txt) return;
        const now = new Date();
        const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
        c.msgs.push({ from: "me", text: txt, t }); c.unread = 0;
        list.insertAdjacentHTML("beforeend", bubbleHtml({ from: "me", text: txt, t }));
        input.value = ""; list.scrollTop = list.scrollHeight;
      };
      document.getElementById("vChatSend").onclick = send;
      input.onkeydown = (e) => { if (e.key === "Enter") send(); };
    },
  };
};

// ============================================================
//  BOOTSTRAP
// ============================================================
window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) location.hash = "#home";
  render();
});
