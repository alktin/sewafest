# SewaFest — Web Prototype

> "Rayakan Lebih Bijak, Sewa Lebih Mudah"
> Marketplace penyewaan perlengkapan acara yang menghubungkan penyewa dengan vendor UMKM lokal di Bekasi.
> Kelompok 4 — Creativity & Innovation

## Cara menjalankan

Tidak perlu build atau instalasi. Cukup **buka `index.html`** di browser (Chrome/Edge/Firefox).

Ini adalah **versi web** (desktop-first, responsif): tampil sebagai situs lebar dengan **navbar atas**.
Gunakan tombol **Penyewa / Vendor** di navbar untuk berpindah antar dua mode.
Butuh koneksi internet agar foto produk/vendor (dari Unsplash) tampil; jika offline, gambar otomatis diganti ikon.

## Apa yang bisa dicoba

### Aplikasi Penyewa (Customer)
- **Beranda** — hero, kategori, produk populer & instagrammable, statistik.
- **Marketplace / Cari** — pencarian, filter kategori (chip), dan urutkan (harga/rating/populer).
- **Detail Produk** — spesifikasi, info vendor, ulasan, tombol "Sewa Sekarang".
- **Profil Vendor** — portofolio, rating, badge terverifikasi, kontak (prioritas feedback).
- **Booking** — **kalender ketersediaan** (hijau/kuning/abu), pilih rentang tanggal + jumlah (prioritas feedback).
- **Keranjang → Checkout → Pembayaran** — VA / GoPay / QRIS dengan 3 status real-time: Menunggu, Berhasil, Dibatalkan.
- **Riwayat Pesanan** — filter status, detail + timeline, dan **form ulasan + rating bintang**.
- **Pesan / Chat** — inbox vendor terpusat (menggantikan koordinasi via WhatsApp).

### Aplikasi Vendor
- **Dashboard** — ringkasan harian, pesanan baru, akses cepat, mini chart pendapatan.
- **Manajemen Pesanan** — terima / tolak / tandai selesai.
- **Kalender Ketersediaan** — ketuk tanggal untuk mengubah status (tersedia → terbatas → penuh).
- **Insight & Pendapatan** — **grafik perbandingan pendapatan bulan ke bulan** (prioritas feedback).
- **Gudang / Inventaris** — stok tiap produk tersinkron dengan kalender.
- **Chat** — balas pesan penyewa.

## Perbaikan berdasarkan hasil User Interview

1. **Redesign UI** — identitas visual khas (plum/magenta + aksen emas, font display Fraunces), bukan template generik.
2. **Kalender ketersediaan lebih jelas** — warna + legenda eksplisit, pemilihan rentang tanggal.
3. **Profil vendor** — halaman lengkap: portofolio, rating, badge, statistik, kontak.
4. **Income comparison** — grafik batang pendapatan 6 bulan di dashboard vendor.

## Struktur file

```
prototype/
├── index.html          # Shell web: navbar atas + konten + footer
├── styles.css          # Design system web-first / brand SewaFest
├── data.js             # Data mock + URL gambar (produk, vendor, kategori, dll.)
├── app.js              # Framework SPA: state, router, navbar, komponen bersama
├── pages-customer.js   # Halaman penyewa (beranda, marketplace, detail, vendor, akun)
├── pages-booking.js    # Alur booking: kalender, keranjang, checkout, pembayaran
├── pages-orders.js     # Riwayat pesanan, ulasan, chat (penyewa)
└── pages-vendor.js     # Dashboard vendor + bootstrap aplikasi
```

Catatan:
- Ini **prototype** — data contoh disimpan di memori (tidak ada backend). Refresh mengembalikan data ke kondisi awal.
- Foto diambil dari **Unsplash** (CDN publik). Tampilan desktop optimal, dan tetap responsif hingga layar ponsel.
