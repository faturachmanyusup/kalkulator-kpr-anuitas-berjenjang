# Kalkulator KPR

Published URL: https://kalkulator-kpr-anuitas-berjenjang.vercel.app

Single Page Application kalkulator KPR (Kredit Pemilikan Rumah) dengan skema bunga anuitas dan tenor berjenjang. Semua kalkulasi berjalan sepenuhnya di sisi klien, tanpa server.

## Fitur

- Input pokok pinjaman dengan format angka otomatis (IDR)
- Tenor berjenjang — setiap tahun dapat memiliki suku bunga yang berbeda
- Kalkulasi angsuran bulanan menggunakan skema bunga anuitas
- Ringkasan total bulan, total bunga, dan total pembayaran
- Tabel rincian angsuran per bulan
- Export ke **XLSX** dan **PDF**

## Tabel Rincian Angsuran

| Kolom | Keterangan |
|---|---|
| Bulan | Nomor bulan angsuran |
| Suku Bunga | Suku bunga tahunan pada bulan tersebut |
| Angsuran Bunga | Komponen bunga pada bulan tersebut |
| Angsuran Pokok | Komponen pokok pada bulan tersebut |
| Angsuran Total | Total angsuran (bunga + pokok) |
| Sisa Pokok Pinjaman | Sisa pokok setelah pembayaran bulan tersebut |

## Tech Stack

- **React 19** + **TypeScript 6** (strict mode)
- **Vite 8**
- **Tailwind CSS v3**
- **xlsx** — export ke XLSX
- **jsPDF** + **jspdf-autotable** — export ke PDF

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

Build untuk produksi:

```bash
npm run build
```
