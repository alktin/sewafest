/* ============================================================
   SewaFest — Orders, order detail, reviews, chat (customer, web)
   ============================================================ */

const STATUS_META = {
  wait:   { pill: "sp-wait",   label: "Menunggu Bayar" },
  active: { pill: "sp-active", label: "Diproses" },
  done:   { pill: "sp-done",   label: "Selesai" },
  cancel: { pill: "sp-cancel", label: "Dibatalkan" },
  new:    { pill: "sp-new",    label: "Baru" },
};

// ---------- Order history ----------
let orderTab = "all";

Routes["orders"] = () => ({
  tab: "orders",
  body: `
  <div class="container container--narrow">
    ${pageHead("Pesanan Saya", "Pantau status pesanan & beri ulasan", false)}
    <div class="chips" id="orderTabs">
      ${[["all","Semua"],["active","Diproses"],["wait","Menunggu"],["done","Selesai"],["cancel","Batal"]]
        .map(([k, l]) => `<div class="chip ${orderTab === k ? "is-active" : ""}" data-ot="${k}">${l}</div>`).join("")}
    </div>
    <div class="stack mt" id="orderList"></div>
    <div style="height:20px"></div>
  </div>
  `,
  after: () => {
    const draw = () => {
      let list = ORDERS.filter(o => orderTab === "all" || o.status === orderTab);
      const box = document.getElementById("orderList");
      if (!list.length) { box.innerHTML = `<div class="empty"><div class="big">🧾</div><b>Belum ada pesanan</b>di kategori ini.</div>`; return; }
      box.innerHTML = list.map(o => {
        const p = getProduct(o.productId);
        const m = STATUS_META[o.status];
        return `<div class="lrow" data-go="order/${o.id}">
          ${imgTag(p.img, p.name, "lrow__img", p.cat, p.icon)}
          <div class="lrow__main">
            <b>${escapeHtml(p.name)}</b>
            <small>${o.id} · 🎉 ${o.eventDate}</small>
            <small style="color:var(--plum-900);font-weight:700">${money(o.total)}</small>
          </div>
          <div class="lrow__right">
            <span class="status-pill ${m.pill}">${m.label}</span>
            ${o.status === "done" && !o.reviewed ? `<br><small style="color:var(--magenta);font-weight:700;margin-top:6px;display:inline-block">★ Beri ulasan</small>` : ""}
          </div>
        </div>`;
      }).join("");
    };
    document.getElementById("orderTabs").onclick = (e) => {
      const c = e.target.closest("[data-ot]"); if (!c) return;
      orderTab = c.dataset.ot;
      document.querySelectorAll("#orderTabs .chip").forEach(x => x.classList.toggle("is-active", x === c));
      draw();
    };
    draw();
  },
});

// ---------- Order detail ----------
Routes["order"] = (id) => {
  const o = ORDERS.find(x => x.id === id);
  if (!o) return { body: notFound(), tab: "orders" };
  const p = getProduct(o.productId);
  const v = getVendor(p.vendor);
  const m = STATUS_META[o.status];
  const steps = [
    ["Pesanan dibuat", true],
    ["Pembayaran", o.status !== "wait" && o.status !== "cancel"],
    ["Vendor konfirmasi & siapkan", o.status === "active" || o.status === "done"],
    ["Barang dikirim/dipakai", o.status === "done"],
    ["Selesai", o.status === "done"],
  ];
  return {
    tab: "orders",
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
        <div class="cart-item">
          ${imgTag(p.img, p.name, "cart-item__img", p.cat, p.icon)}
          <div class="cart-item__info">
            <b>${escapeHtml(p.name)}</b>
            <small>${v.name} · ${o.qty}×</small>
            <b style="color:var(--plum-900)">${money(o.total)}</b>
          </div>
        </div>
      </div>

      <div class="card">
        <b style="font-size:15px">Detail Acara</b>
        <div class="spec-list mt-s">
          <div class="spec"><span>Tanggal acara</span><span>🎉 ${o.eventDate}</span></div>
          <div class="spec"><span>Tanggal pesan</span><span>${o.date}</span></div>
          <div class="spec"><span>Alamat</span><span>${escapeHtml(o.address)}</span></div>
        </div>
      </div>

      <div class="card">
        <b style="font-size:15px">Status Pesanan</b>
        <div class="stack mt-s" style="gap:0">
          ${steps.map(([label, done], i) => `
            <div class="row" style="gap:12px;padding:9px 0">
              <div style="width:24px;height:24px;border-radius:999px;flex:0 0 auto;display:grid;place-items:center;font-size:12px;
                background:${done ? "var(--grad-brand)" : "var(--line)"};color:${done ? "#fff" : "var(--ink-soft)"}">${done ? "✓" : i+1}</div>
              <span style="${done ? "font-weight:600" : "color:var(--ink-soft)"}">${label}</span>
            </div>`).join("")}
        </div>
      </div>

      <div class="row mt" style="gap:12px">
        <button class="btn btn--ghost" data-go="chats">💬 Chat Vendor</button>
        ${o.status === "done" && !o.reviewed ? `<button class="btn btn--primary" data-go="review/${o.id}">★ Beri Ulasan</button>` : ""}
        ${o.status === "wait" ? `<button class="btn btn--gold" data-go="checkout">Bayar Sekarang</button>` : ""}
      </div>
      ${o.reviewed ? `<div class="note mt">✅ Kamu sudah memberi ulasan untuk pesanan ini. Terima kasih!</div>` : ""}
      <div style="height:20px"></div>
    </div>
    `,
  };
};

// ---------- Review form ----------
Routes["review"] = (id) => {
  const o = ORDERS.find(x => x.id === id);
  if (!o) return { body: notFound(), tab: "orders" };
  const p = getProduct(o.productId);
  return {
    tab: "orders",
    body: `
    <div class="container container--narrow">
      ${pageHead("Beri Ulasan", null)}
      <div class="card center">
        ${imgTag(p.img, p.name, "cart-item__img", p.cat, p.icon).replace("cart-item__img", "cart-item__img").replace("<img ", `<img style="width:90px;height:72px;margin:0 auto" `)}
        <b style="font-size:16px;display:block;margin-top:10px">${escapeHtml(p.name)}</b>
        <small class="muted">${getVendor(p.vendor).name}</small>
        <div class="star-pick" id="starPick">${[1,2,3,4,5].map(n => `<span data-star="${n}">★</span>`).join("")}</div>
        <small class="muted" id="starLabel">Klik bintang untuk menilai</small>
      </div>

      <div class="card">
        <div class="field" style="margin-bottom:12px"><label>Tulis ulasanmu</label>
          <textarea id="revText" placeholder="Bagaimana kualitas barang & pelayanan vendor?"></textarea></div>
        <label style="font-size:13px;font-weight:600;color:var(--plum-800)">Tambah foto (opsional)</label>
        <div class="row mt-s" style="gap:8px">
          <div style="width:64px;height:64px;border:1.5px dashed var(--line);border-radius:12px;display:grid;place-items:center;font-size:22px;color:var(--ink-soft);cursor:pointer" onclick="toast('Prototype: upload foto')">📷</div>
          <div style="width:64px;height:64px;border:1.5px dashed var(--line);border-radius:12px;display:grid;place-items:center;font-size:22px;color:var(--ink-soft);cursor:pointer" onclick="toast('Prototype: upload foto')">＋</div>
        </div>
      </div>

      <div class="mt"><button class="btn btn--primary btn--block btn--lg" id="submitRev">Kirim Ulasan</button></div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => {
      let rating = 0;
      const labels = ["", "Buruk 😞", "Kurang 😐", "Cukup 🙂", "Bagus 😀", "Luar biasa 🤩"];
      const pick = document.getElementById("starPick");
      pick.onclick = (e) => {
        const s = e.target.closest("[data-star]"); if (!s) return;
        rating = parseInt(s.dataset.star);
        pick.querySelectorAll("span").forEach((el, i) => el.classList.toggle("on", i < rating));
        document.getElementById("starLabel").textContent = labels[rating];
      };
      document.getElementById("submitRev").onclick = () => {
        if (!rating) { toast("Pilih rating bintang dahulu ⭐"); return; }
        o.reviewed = true;
        toast("Ulasan terkirim, terima kasih! 💜");
        go("order/" + o.id);
      };
    },
  };
};

// ---------- Chat list ----------
Routes["chats"] = () => ({
  tab: "chats",
  body: `
  <div class="container container--narrow">
    ${pageHead("Pesan", "Chat terpusat dengan vendor — ganti koordinasi via WhatsApp", false)}
    <div class="stack">
      ${Object.values(CHATS).map(c => {
        const v = getVendor(c.vendor);
        const last = c.msgs[c.msgs.length - 1];
        return `<div class="lrow" data-go="chat/${c.vendor}">
          ${imgTag(v.logo, v.name, "lrow__img", "lainnya", v.icon)}
          <div class="lrow__main">
            <b>${escapeHtml(v.name)} ${v.verified ? '<span class="verified">✓</span>' : ""}</b>
            <small style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(last.text)}</small>
          </div>
          <div class="lrow__right"><small class="muted">${last.t}</small></div>
        </div>`;
      }).join("")}
    </div>
    <div class="note mt">💬 Negosiasi, tanya ketersediaan, dan konfirmasi detail acara di satu inbox.</div>
    <div style="height:20px"></div>
  </div>
  `,
});

// ---------- Chat thread ----------
Routes["chat"] = (vendorId) => {
  const c = CHATS[vendorId];
  const v = getVendor(vendorId);
  if (!c || !v) return { body: notFound(), tab: "chats" };
  return {
    tab: "chats",
    body: `
    <div class="container container--narrow">
      ${pageHead("Chat", null)}
      <div class="chat-wrap" style="margin-top:0">
        <div class="chat-head">
          ${imgTag(v.logo, v.name, "", "lainnya", v.icon)}
          <div><b>${escapeHtml(v.name)}</b><br><small>Online · Respon ~${v.responseMin}m</small></div>
        </div>
        <div class="chat-list" id="chatList">${c.msgs.map(bubbleHtml).join("")}</div>
        <div class="chat-input">
          <input id="chatMsg" placeholder="Tulis pesan…" />
          <button class="chat-send" id="chatSend">➤</button>
        </div>
      </div>
      <div style="height:20px"></div>
    </div>
    `,
    after: () => {
      const list = document.getElementById("chatList");
      const input = document.getElementById("chatMsg");
      list.scrollTop = list.scrollHeight;
      const send = () => {
        const txt = input.value.trim(); if (!txt) return;
        const now = new Date();
        const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
        c.msgs.push({ from: "me", text: txt, t });
        list.insertAdjacentHTML("beforeend", bubbleHtml({ from: "me", text: txt, t }));
        input.value = ""; list.scrollTop = list.scrollHeight;
        setTimeout(() => {
          const reply = { from: "them", text: "Baik kak, kami cek dulu ketersediaannya ya 😊", t };
          c.msgs.push(reply);
          list.insertAdjacentHTML("beforeend", bubbleHtml(reply));
          list.scrollTop = list.scrollHeight;
        }, 900);
      };
      document.getElementById("chatSend").onclick = send;
      input.onkeydown = (e) => { if (e.key === "Enter") send(); };
    },
  };
};

function bubbleHtml(m) {
  return `<div class="bubble ${m.from === "me" ? "me" : "them"}">${escapeHtml(m.text)}<small>${m.t}</small></div>`;
}
