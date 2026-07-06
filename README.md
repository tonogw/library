# 📚 Booky - Modern Library Platform

**Booky** adalah aplikasi manajemen perpustakaan modern berbasis web yang dirancang dengan performa tinggi, keamanan ketat, serta visual yang presisi. Aplikasi ini mengintegrasikan ekosistem pencarian katalog, manajemen peminjaman buku secara _real-time_, hingga sistem ulasan interaktif yang dibangun menggunakan arsitektur mutakhir.

---

## ✨ Fitur & Kelebihan Aplikasi

Aplikasi ini dirancang dengan pendekatan berorientasi performa dan skalabilitas tinggi. Berikut adalah keunggulan utama platform Booky:

### 🚀 1. Arsitektur Mutakhir dengan React Router v7 & SSR

- **Performa Produksi Optimal:** Memanfaatkan arsitektur kompilasi super cepat menggunakan Vite v8 dan React Router v7 untuk rendering sisi server (_Server-Side Rendering / SSR_).
- **SEO & Loading Kilat:** Menggunakan _Server-Side Rendering_ sehingga data buku, katalog, dan profil penulis langsung ter-render dari server, memberikan waktu muat instan dan indeks SEO yang sangat baik.

### 🛡️ 2. Sistem Proteksi Rute Berlapis (Advanced Routing Guards)

- **Satpam Keamanan Terpusat:** Menggunakan struktur pembungkus `user-protected` dan `admin-protected` berbasis tata letak (_layout_) React Router untuk mengisolasi area sensitif.
- **Toleransi Token Pintar:** Mengamankan area transaksi krusial (seperti _Cart_ dan _Checkout_) sekaligus meminimalkan waktu tunggu sinkronisasi sesi dengan validasi _local token_ cadangan agar pengguna tidak terpental paksa saat penyegaran halaman.

### 📊 3. Sinkronisasi Data Real-Time & Adaptif

- **Manajemen State Cerdas TanStack Query:** Mengimplementasikan pengambilan data (_fetching_) asynchronous menggunakan React Query v5 untuk menjamin data katalog, profil popular penulis, dan status ulasan selalu segar (_fresh_) tanpa _refresh_ manual.
- **Badge Dinamis Pintar:** Keranjang belanja (Bag Icon) dilengkapi penghitung badge dinamis yang langsung membaca parameter dari backend database secara presisi tanpa beban komputasi berlebih pada browser client.

### 🎨 4. Antarmuka Komponen Modular & Presisi Figma

- **Presisi Piksel Sesuai Desain:** Dibangun mengikuti standar arsitektur UI kontemporer dengan tipografi font 'Quicksand' dan warna palet tajam yang diisolasi dengan rapi dari interferensi elemen global.
- **Interaktivitas Tanpa Batas:** Modul ulasan dilengkapi dengan dialog _pop-up modal_ interaktif, pemilihan bintang responsif, serta validasi aturan bisnis ketat (hanya memperbolehkan ulasan untuk buku yang telah sukses dikembalikan).

---

## 🛠️ Tech Stack (Tumpukan Teknologi)

### Core Technologies

- **Framework:** React 19 & React Router v7 (Beta/Latest SSR Architecture)
- **Language:** TypeScript v6 (Strict Type Checking)
- **State Management:** Redux Toolkit & React-Redux (Auth state)
- **Data Fetching:** TanStack React-Query v5 & Axios

### UI & Styling

- **Styling Framework:** Tailwind CSS v4 (Next-gen compilation)
- **Component Foundation:** Radix UI Premium Primitives & shadcn/ui
- **Animation:** Framer Motion & Motion v12
- **Icons & Notifications:** Lucide-React & Sonner Toast

---

## ⚙️ Skrip Perintah (Scripts)

Di dalam repositori ini, Bapak dapat menjalankan perintah-perintah berikut untuk pengembangan dan produksi:

### Menjalankan Mode Pengembangan (Development)

Untuk menaikkan aplikasi di server lokal dengan fitur _Hot Module Replacement (HMR)_:

```bash
npm run dev
```
