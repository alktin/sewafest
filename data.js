/* ============================================================
   SewaFest — Mock data for the prototype
   ============================================================ */

/* Image helper — Unsplash CDN (stable photo IDs). img(id, w) builds a sized URL. */
function img(photoId, w = 600) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&q=70`;
}

const CATEGORIES = [
  { id: "tenda",   name: "Tenda",        icon: "⛺",  img: img("1464366400600-7168b8af9bc3", 300) },
  { id: "sound",   name: "Sound System", icon: "🔊",  img: img("1511379938547-c1f69419868d", 300) },
  { id: "dekor",   name: "Dekorasi",     icon: "🎈",  img: img("1530103862676-de8c9debad1d", 300) },
  { id: "kursi",   name: "Kursi & Meja", icon: "🪑",  img: img("1519167758481-83f550bb49b3", 300) },
  { id: "catering",name: "Katering",     icon: "🍽️", img: img("1555244162-803834f70033", 300) },
  { id: "panggung",name: "Panggung",     icon: "🎤",  img: img("1540039155733-5bb30b53aa14", 300) },
  { id: "lampu",   name: "Lighting",     icon: "💡",  img: img("1492684223066-81342ee5ff30", 300) },
  { id: "lainnya", name: "Lainnya",      icon: "✨",  img: img("1513151233558-d860c5398176", 300) },
];

/* Shared banner/hero images */
const HERO_IMG = img("1530103862676-de8c9debad1d", 1200);
const CTA_IMG  = img("1519741497674-611481863552", 1200);

const VENDORS = {
  v1: {
    id: "v1", name: "Berkah Tenda Bekasi", initial: "B", icon: "⛺",
    area: "Bekasi Timur", verified: true, rating: 4.9, reviews: 214,
    since: "2016", orders: 1280, responseMin: 8,
    logo: img("1521737604893-d14cc237f11d", 160),
    cover: img("1464366400600-7168b8af9bc3", 1000),
    bio: "Spesialis tenda pesta & dekorasi outdoor. Melayani Bekasi dan sekitarnya sejak 2016. Barang terawat, pemasangan rapi, tepat waktu.",
    badges: ["Terverifikasi", "Respon Cepat", "Top Vendor 2025"],
  },
  v2: {
    id: "v2", name: "Suara Merdeka Audio", initial: "S", icon: "🔊",
    area: "Bekasi Barat", verified: true, rating: 4.8, reviews: 156,
    since: "2018", orders: 870, responseMin: 15,
    logo: img("1507003211169-0a1dd7228f2d", 160),
    cover: img("1511379938547-c1f69419868d", 1000),
    bio: "Sound system & lighting untuk acara kecil hingga besar. Teknisi standby di lokasi. Clear sound, no trouble.",
    badges: ["Terverifikasi", "Teknisi On-site"],
  },
  v3: {
    id: "v3", name: "Pesta Ceria Dekorasi", initial: "P", icon: "🎈",
    area: "Tambun Selatan", verified: true, rating: 4.7, reviews: 98,
    since: "2020", orders: 540, responseMin: 20,
    logo: img("1494790108377-be9c29b29330", 160),
    cover: img("1530103862676-de8c9debad1d", 1000),
    bio: "Dekorasi ulang tahun, baby shower, dan gender reveal. Tema custom instagrammable sesuai request.",
    badges: ["Terverifikasi", "Dekor Custom"],
  },
  v4: {
    id: "v4", name: "Rukun Kursi Jaya", initial: "R", icon: "🪑",
    area: "Bekasi Selatan", verified: false, rating: 4.5, reviews: 61,
    since: "2021", orders: 320, responseMin: 35,
    logo: img("1500648767791-00dcc994a43e", 160),
    cover: img("1519167758481-83f550bb49b3", 1000),
    bio: "Sewa kursi, meja bulat, dan taplak untuk hajatan & resepsi. Harga grosir untuk jumlah besar.",
    badges: ["Harga Grosir"],
  },
};

const PRODUCTS = [
  { id: "p1", cat: "tenda", vendor: "v1", icon: "⛺", img: img("1464366400600-7168b8af9bc3"), name: "Tenda Dekorasi 6×8m Full Set",
    price: 850000, unit: "hari", rating: 4.9, reviews: 128, booked: 342,
    tags: ["Populer"], badge: "Best Seller",
    desc: "Tenda pesta ukuran 6×8 meter lengkap dengan dekorasi kain plafon, lampu gantung, dan karpet. Termasuk pemasangan & pembongkaran.",
    specs: [["Ukuran","6 × 8 meter"],["Kapasitas","± 60 orang"],["Isi paket","Rangka, atap, kain plafon, karpet"],["Pasang/bongkar","Termasuk"],["Deposit","Rp 200.000"]],
  },
  { id: "p2", cat: "sound", vendor: "v2", icon: "🔊", img: img("1511379938547-c1f69419868d"), name: "Paket Sound System 2000 Watt",
    price: 1200000, unit: "hari", rating: 4.8, reviews: 94, booked: 210,
    tags: ["Populer"], badge: "Teknisi",
    desc: "Sound system 2000W cocok untuk acara 100–200 tamu. Termasuk 2 speaker, mixer, 2 mic wireless, dan teknisi on-site.",
    specs: [["Daya","2000 Watt"],["Kapasitas","100–200 tamu"],["Isi paket","2 speaker, mixer, 2 mic"],["Teknisi","Termasuk"],["Deposit","Rp 300.000"]],
  },
  { id: "p3", cat: "dekor", vendor: "v3", icon: "🎈", img: img("1530103862676-de8c9debad1d"), name: "Dekorasi Balon Ulang Tahun Custom",
    price: 450000, unit: "paket", rating: 4.7, reviews: 76, booked: 188,
    tags: ["Instagrammable"], badge: "Custom",
    desc: "Dekorasi balon tema custom untuk ulang tahun anak. Pilih warna & tema sesuai keinginan. Termasuk backdrop & properti foto.",
    specs: [["Tema","Custom sesuai request"],["Isi paket","Backdrop, balon garland, properti"],["Area pasang","± 3 × 2 meter"],["Pasang","Termasuk"],["Deposit","Tidak ada"]],
  },
  { id: "p4", cat: "kursi", vendor: "v4", icon: "🪑", img: img("1519167758481-83f550bb49b3"), name: "Kursi Lipat Chiavari (50 pcs)",
    price: 500000, unit: "hari", rating: 4.5, reviews: 42, booked: 96,
    tags: [], badge: null,
    desc: "50 kursi Chiavari gold dengan bantalan, cocok untuk resepsi & gathering. Harga sudah termasuk antar-jemput area Bekasi.",
    specs: [["Jumlah","50 pcs"],["Model","Chiavari gold + bantalan"],["Antar-jemput","Termasuk (Bekasi)"],["Deposit","Rp 150.000"]],
  },
  { id: "p5", cat: "panggung", vendor: "v1", icon: "🎤", img: img("1540039155733-5bb30b53aa14"), name: "Panggung Knockdown 4×6m",
    price: 1500000, unit: "hari", rating: 4.8, reviews: 55, booked: 70,
    tags: [], badge: null,
    desc: "Panggung knockdown tinggi 60cm ukuran 4×6m dengan karpet dan tangga. Kuat untuk band & tarian.",
    specs: [["Ukuran","4 × 6 meter"],["Tinggi","60 cm"],["Isi paket","Panggung, karpet, tangga"],["Pasang","Termasuk"],["Deposit","Rp 400.000"]],
  },
  { id: "p6", cat: "lampu", vendor: "v2", icon: "💡", img: img("1492684223066-81342ee5ff30"), name: "Lighting Par LED + Smoke (8 unit)",
    price: 700000, unit: "hari", rating: 4.6, reviews: 38, booked: 64,
    tags: ["Instagrammable"], badge: null,
    desc: "8 lampu Par LED warna-warni + 1 smoke machine untuk suasana pesta meriah. Termasuk controller.",
    specs: [["Jumlah","8 Par LED + 1 smoke"],["Kontrol","DMX controller"],["Teknisi","Opsional (+Rp 150.000)"],["Deposit","Rp 200.000"]],
  },
  { id: "p7", cat: "catering", vendor: "v3", icon: "🍽️", img: img("1555244162-803834f70033"), name: "Prasmanan 100 Porsi (6 menu)",
    price: 3500000, unit: "paket", rating: 4.9, reviews: 61, booked: 120,
    tags: ["Populer"], badge: "Favorit",
    desc: "Paket prasmanan 100 porsi, 6 pilihan menu + nasi + buah + air mineral. Termasuk pramusaji & meja prasmanan.",
    specs: [["Porsi","100 orang"],["Menu","6 lauk + nasi + buah + minum"],["Pramusaji","2 orang"],["Deposit","Rp 500.000"]],
  },
  { id: "p8", cat: "dekor", vendor: "v3", icon: "🌸", img: img("1519225421980-715cb0215aed"), name: "Backdrop Flower Wall Premium",
    price: 650000, unit: "hari", rating: 4.8, reviews: 44, booked: 88,
    tags: ["Instagrammable"], badge: null,
    desc: "Flower wall 2×2,4m dengan bunga artificial premium. Spot foto favorit untuk lamaran & wedding.",
    specs: [["Ukuran","2 × 2,4 meter"],["Bahan","Bunga artificial premium"],["Pasang","Termasuk"],["Deposit","Rp 200.000"]],
  },
  { id: "p9", cat: "sound", vendor: "v2", icon: "🎙️", img: img("1470019693664-1d202d2c0907"), name: "Paket Karaoke Mini + 2 Mic",
    price: 400000, unit: "hari", rating: 4.4, reviews: 29, booked: 51,
    tags: [], badge: "Hemat",
    desc: "Speaker aktif portable + 2 mic wireless + tablet lagu. Pas untuk acara rumahan & arisan.",
    specs: [["Daya","500 Watt"],["Isi paket","Speaker, 2 mic, tablet lagu"],["Kapasitas","± 30 tamu"],["Deposit","Rp 100.000"]],
  },
  { id: "p10", cat: "tenda", vendor: "v1", icon: "🏕️", img: img("1504280390367-361c6d9f38f4"), name: "Tenda Sarnafil 3×3m (Booth)",
    price: 300000, unit: "hari", rating: 4.6, reviews: 33, booked: 77,
    tags: ["Hemat"], badge: null,
    desc: "Tenda sarnafil 3×3m putih untuk booth bazar atau area tambahan. Cepat pasang, tahan hujan.",
    specs: [["Ukuran","3 × 3 meter"],["Warna","Putih"],["Pasang","Termasuk"],["Deposit","Rp 100.000"]],
  },
  { id: "p11", cat: "kursi", vendor: "v4", icon: "🍽️", img: img("1414235077428-338989a2e8c0"), name: "Meja Bulat + Taplak (10 set)",
    price: 650000, unit: "hari", rating: 4.5, reviews: 25, booked: 40,
    tags: [], badge: null,
    desc: "10 meja bulat kapasitas 10 orang + taplak satin. Cocok untuk resepsi semi-formal.",
    specs: [["Jumlah","10 meja (kap. 10 org)"],["Taplak","Satin, pilihan warna"],["Antar-jemput","Termasuk"],["Deposit","Rp 150.000"]],
  },
  { id: "p12", cat: "lampu", vendor: "v1", icon: "✨", img: img("1513151233558-d860c5398176"), name: "Lampu Tumblr & Fairy Light 50m",
    price: 250000, unit: "hari", rating: 4.7, reviews: 48, booked: 130,
    tags: ["Instagrammable","Hemat"], badge: null,
    desc: "50 meter fairy light warm white untuk mempercantik area pesta. Hemat & bikin suasana hangat.",
    specs: [["Panjang","50 meter"],["Warna","Warm white"],["Pasang","Termasuk"],["Deposit","Tidak ada"]],
  },
];

const REVIEWS = {
  p1: [
    { user: "Sari R.", initial: "S", stars: 5, date: "2 minggu lalu", text: "Tendanya bersih dan dekornya cantik banget! Pesta ulang tahun anak jadi berkesan. Pasang tepat waktu.", photos: ["📷","📷"] },
    { user: "Dika P.", initial: "D", stars: 5, date: "1 bulan lalu", text: "Order buat klien, hasilnya rapi. Vendor responsif dan on-time. Recommended.", photos: [] },
    { user: "Nina", initial: "N", stars: 4, date: "1 bulan lalu", text: "Bagus, cuma karpet agak kurang bersih sedikit. Overall puas.", photos: ["📷"] },
  ],
  p2: [
    { user: "Dika P.", initial: "D", stars: 5, date: "3 minggu lalu", text: "Suaranya jernih, teknisi sigap. Acara 150 tamu lancar tanpa kendala.", photos: [] },
    { user: "Budi", initial: "B", stars: 5, date: "1 bulan lalu", text: "Mantap, mic wireless gak putus-putus. Teknisi standby terus.", photos: ["📷"] },
  ],
  p3: [
    { user: "Sari R.", initial: "S", stars: 5, date: "1 minggu lalu", text: "Tema custom sesuai request, warnanya pas banget sama undangan. Instagrammable!", photos: ["📷","📷","📷"] },
    { user: "Rani", initial: "R", stars: 4, date: "3 minggu lalu", text: "Lucu dan rapi. Datang agak mepet jam acara tapi hasilnya oke.", photos: [] },
  ],
};

// Day availability map for the booking calendar.
// status: available | limited | booked (keyed by day-of-month for the shown month)
function makeAvailability(seed) {
  const map = {};
  for (let d = 1; d <= 31; d++) {
    const n = (d * seed * 7 + seed) % 10;
    if (n < 2) map[d] = "booked";
    else if (n < 4) map[d] = "limited";
    else map[d] = "available";
  }
  return map;
}

// Customer-side orders (history)
const ORDERS = [
  { id: "SWF-240931", productId: "p3", qty: 1, status: "done", date: "28 Sep 2026",
    eventDate: "5 Okt 2026", total: 465000, reviewed: false, address: "Jl. Kemakmuran No. 12, Bekasi Timur" },
  { id: "SWF-240918", productId: "p1", qty: 1, status: "active", date: "20 Sep 2026",
    eventDate: "12 Okt 2026", total: 865000, reviewed: false, address: "Perumahan Harapan Indah Blok C2, Bekasi Barat" },
  { id: "SWF-240902", productId: "p12", qty: 2, status: "wait", date: "18 Sep 2026",
    eventDate: "9 Okt 2026", total: 500000, reviewed: false, address: "Jl. Mawar Raya No. 7, Tambun Selatan" },
  { id: "SWF-240815", productId: "p9", qty: 1, status: "done", date: "10 Agu 2026",
    eventDate: "15 Agu 2026", total: 400000, reviewed: true, address: "Jl. Flamboyan No. 3, Bekasi Selatan" },
  { id: "SWF-240722", productId: "p2", qty: 1, status: "cancel", date: "22 Jul 2026",
    eventDate: "30 Jul 2026", total: 1200000, reviewed: false, address: "Gedung Serbaguna RW 05, Bekasi Timur" },
];

// Chat threads (customer side)
const CHATS = {
  v1: { vendor: "v1", msgs: [
    { from: "them", text: "Halo kak, terima kasih sudah order Tenda 6×8m 😊", t: "09:12" },
    { from: "them", text: "Untuk tanggal 12 Okt sudah kami kunci ya. Alamat pemasangan di Harapan Indah betul?", t: "09:12" },
    { from: "me", text: "Betul kak. Kira-kira tim datang jam berapa?", t: "09:20" },
    { from: "them", text: "Tim kami datang H-1 sore sekitar jam 15.00 untuk pasang. Besoknya tinggal pakai 👍", t: "09:22" },
    { from: "me", text: "Oke siap, terima kasih!", t: "09:25" },
  ]},
  v2: { vendor: "v2", msgs: [
    { from: "me", text: "Kak sound 2000W masih available tgl 20 Okt?", t: "Kemarin" },
    { from: "them", text: "Masih kak, slot pagi & sore ada. Mau yang mana?", t: "Kemarin" },
  ]},
  v3: { vendor: "v3", msgs: [
    { from: "them", text: "Dekor balonnya sudah selesai dipasang ya kak, selamat berpesta! 🎉", t: "2 hari lalu" },
    { from: "me", text: "Baguuus banget! Makasih yaa 🥰", t: "2 hari lalu" },
  ]},
};

// ---------- Vendor-side data ----------
const VENDOR_ME = VENDORS.v1;

const VENDOR_INVENTORY = [
  { id: "p1", icon: "⛺", img: img("1464366400600-7168b8af9bc3", 160), name: "Tenda Dekorasi 6×8m Full Set", total: 8, available: 3, price: 850000 },
  { id: "p5", icon: "🎤", img: img("1540039155733-5bb30b53aa14", 160), name: "Panggung Knockdown 4×6m", total: 4, available: 2, price: 1500000 },
  { id: "p10", icon: "🏕️", img: img("1504280390367-361c6d9f38f4", 160), name: "Tenda Sarnafil 3×3m (Booth)", total: 20, available: 14, price: 300000 },
  { id: "p12", icon: "✨", img: img("1513151233558-d860c5398176", 160), name: "Lampu Tumblr & Fairy Light 50m", total: 15, available: 15, price: 250000 },
];

const VENDOR_ORDERS = [
  { id: "SWF-240918", customer: "Sari Rahayu", product: "Tenda Dekorasi 6×8m", qty: 1, status: "new",
    eventDate: "12 Okt 2026", total: 865000, address: "Harapan Indah Blok C2, Bekasi Barat", phone: "0812-xxxx-1234" },
  { id: "SWF-240925", customer: "Dika Pratama", product: "Panggung Knockdown 4×6m", qty: 1, status: "new",
    eventDate: "18 Okt 2026", total: 1500000, address: "Gedung Graha, Bekasi Timur", phone: "0813-xxxx-5678" },
  { id: "SWF-240910", customer: "Rina Melati", product: "Tenda Sarnafil 3×3m", qty: 4, status: "active",
    eventDate: "9 Okt 2026", total: 1200000, address: "Jl. Mawar, Tambun", phone: "0857-xxxx-9012" },
  { id: "SWF-240902", customer: "Budi Santoso", product: "Lampu Fairy Light 50m", qty: 2, status: "done",
    eventDate: "2 Okt 2026", total: 500000, address: "Perum Villa, Bekasi Selatan", phone: "0821-xxxx-3456" },
];

// Monthly income for the comparison chart (feedback priority)
const VENDOR_INCOME = [
  { month: "Mei", value: 14.2 },
  { month: "Jun", value: 16.8 },
  { month: "Jul", value: 15.1 },
  { month: "Agu", value: 19.4 },
  { month: "Sep", value: 22.7 },
  { month: "Okt", value: 26.3 },
];

const VENDOR_CHATS = {
  c1: { name: "Sari Rahayu", initial: "S", last: "Oke siap, terima kasih!", t: "09:25", unread: 0, msgs: [
    { from: "them", text: "Halo kak, mau tanya tenda 6×8 tgl 12 Okt masih ada?", t: "09:05" },
    { from: "me", text: "Masih ada kak, slot tanggal 12 Okt available 😊", t: "09:08" },
    { from: "them", text: "Oke siap, terima kasih!", t: "09:25" },
  ]},
  c2: { name: "Dika Pratama", initial: "D", last: "Butuh invoice buat klien ya kak", t: "Kemarin", unread: 2, msgs: [
    { from: "them", text: "Kak order panggung utk 18 Okt sudah masuk", t: "Kemarin" },
    { from: "them", text: "Butuh invoice buat klien ya kak", t: "Kemarin" },
  ]},
};

function rupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}
function rupiahShort(jt) {
  return "Rp " + jt.toLocaleString("id-ID") + " jt";
}
function getProduct(id) { return PRODUCTS.find(p => p.id === id); }
function getVendor(id) { return VENDORS[id]; }
