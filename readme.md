# Website Vlog / Jurnal Multimedia

## 1. Konsep Proyek

Website ini merupakan website pribadi berbentuk vlog/jurnal multimedia yang berisi kumpulan:

- Video
- Foto
- Cerita/deskripsi
- Waktu/tanggal
- Lokasi

Website dibuat **tanpa database dan tanpa backend**. Data konten disimpan menggunakan file JSON, sedangkan file video dan foto disimpan di dalam folder masing-masing.

Alur data utama:

```text
HTML
  ↕
JavaScript
  ↕
JSON
  ↕
File Video / Foto
```

---

## 2. Struktur Folder

Struktur dasar proyek:

```text
website-vlog/
│
├── index.html
├── video.html
├── foto.html
├── README.md
│
├── css/
│   ├── style.css
│   │
│   └── bootstrap/
│       ├── bootstrap.min.css
│       └── bootstrap.bundle.min.js
│
├── javascript/
│   ├── ...
│
├── json/
│   ├── video.json
│   └── foto.json
│
├── video/
│   ├── video-001.mp4
│   └── ...
│
└── images/
    ├── thumb-001.jpg
    ├── foto-001.jpg
    └── ...
```

### Keterangan

- `index.html` → halaman utama.
- `video.html` → halaman untuk menampilkan detail video.
- `foto.html` → halaman untuk menampilkan detail foto.
- `css/` → seluruh file CSS.
- `css/bootstrap/` → Bootstrap lokal.
- `javascript/` → file JavaScript berdasarkan fitur.
- `json/` → data video dan foto.
- `video/` → file video.
- `images/` → file foto dan thumbnail.

---

## 3. Teknologi

Teknologi yang digunakan:

- HTML
- CSS
- JavaScript
- JSON
- Bootstrap lokal

Tidak menggunakan:

- Database
- PHP
- Backend
- Server API

---

## 4. Aturan CSS

Semua pengaturan tampilan diletakkan di CSS.

HTML tidak digunakan untuk menyimpan aturan ukuran atau styling yang seharusnya berada di CSS.

CSS mengatur:

- Ukuran elemen
- Layout
- Jarak
- Warna
- Font
- Responsive design
- Ukuran video
- Ukuran foto
- Carousel/slider
- Timeline
- Filter lokasi

Website harus responsive pada:

- Desktop
- Tablet
- Mobile

Pendekatan responsive menggunakan ukuran fleksibel seperti `%`, `max-width`, `clamp()`, `aspect-ratio`, dan media query jika diperlukan.

---

## 5. Aturan JavaScript

JavaScript digunakan untuk mengatur seluruh logika dan interaksi website.

JavaScript tidak dibuat menjadi satu file besar.

Setiap fitur dibuat dalam file JavaScript yang sesuai dengan fungsinya.

Contoh konsep:

```text
javascript/
├── carousel-video.js
├── carousel-foto.js
├── timeline.js
├── filter-lokasi.js
└── ...
```

Nama dan pembagian file dapat disesuaikan ketika implementasi dimulai.

---

# 6. JSON

Data dibagi menjadi dua file JSON:

```text
json/
├── video.json
└── foto.json
```

## 6.1 `video.json`

Field yang digunakan:

| Field | Keterangan |
|---|---|
| `id` | ID video |
| `judul` | Judul video |
| `deskripsi` | Deskripsi/cerita video |
| `path` | Lokasi file video |
| `time` | Tanggal video |
| `thumbnail` | Lokasi thumbnail video |
| `lokasi` | Lokasi tempat video dibuat |

Contoh:

```json
[
  {
    "id": 1,
    "judul": "Perjalanan ke Pantai",
    "deskripsi": "Video perjalanan kami menuju pantai.",
    "path": "video/video-001.mp4",
    "time": "2026-09-28",
    "thumbnail": "images/thumb-001.jpg",
    "lokasi": "Lokasi A"
  }
]
```

---

## 6.2 `foto.json`

Field yang digunakan:

| Field | Keterangan |
|---|---|
| `id` | ID foto |
| `judul` | Judul foto |
| `deskripsi` | Deskripsi/cerita foto |
| `path` | Lokasi file foto |
| `time` | Tanggal foto |
| `lokasi` | Lokasi tempat foto dibuat |

Contoh:

```json
[
  {
    "id": 1,
    "judul": "Menikmati Senja",
    "deskripsi": "Momen ketika menikmati matahari terbenam.",
    "path": "images/foto-001.jpg",
    "time": "2026-09-28",
    "lokasi": "Lokasi A"
  }
]
```

---

# 7. Format Waktu

Field `time` menggunakan format:

```text
YYYY-MM-DD
```

Contoh:

```text
2026-09-28
```

Format ini digunakan supaya data lebih mudah:

- Diurutkan berdasarkan tanggal
- Difilter berdasarkan tanggal
- Digunakan pada timeline
- Dibandingkan antara data foto dan video

---

# 8. Halaman `index.html`

`index.html` merupakan halaman utama untuk menjelajahi konten.

Konsep tampilan:

```text
┌──────────────────────────────────────┐
│              JUDUL                   │
├──────────────────────────────────────┤
│                                      │
│        VIDEO SLIDER / CAROUSEL       │
│                                      │
├──────────────────────────────────────┤
│                                      │
│         FOTO SLIDER / CAROUSEL       │
│                                      │
├──────────────────────────────────────┤
│                                      │
│              TIMELINE                │
│                                      │
│    ●──────●──────●──────●            │
│   Sep    Sep    Sep    Okt            │
│                                      │
├──────────────────────────────────────┤
│                                      │
│              LOKASI                  │
│                                      │
│ [Semua] [Lokasi A] [Lokasi B]        │
│              [Lokasi C]              │
│                                      │
└──────────────────────────────────────┘
```

---

## 8.1 Video Slider

Di bawah judul terdapat slider/carousel video.

Video ditampilkan dalam bentuk thumbnail.

Slider dapat bergerak otomatis.

Data video diambil dari:

```text
json/video.json
```

Ketika pengguna memilih salah satu video, pengguna dapat diarahkan ke halaman:

```text
video.html
```

dengan video yang dipilih.

---

## 8.2 Foto Slider

Di bawah video slider terdapat slider/carousel foto.

Data foto diambil dari:

```text
json/foto.json
```

Ketika pengguna memilih salah satu foto, pengguna dapat diarahkan ke:

```text
foto.html
```

dengan foto yang dipilih.

---

# 9. Timeline

Bagian bawah halaman utama memiliki timeline.

Timeline menggunakan bentuk node/circle yang dihubungkan dengan garis.

Contoh:

```text
●────────●────────●────────●
28 Sep   29 Sep   30 Sep   1 Okt
```

Timeline digunakan sebagai navigasi berdasarkan waktu.

Ketika pengguna memilih tanggal tertentu, konten video dan foto yang memiliki `time` yang sesuai dapat ditampilkan atau difilter.

Contoh:

```text
Timeline
    ↓
2026-09-28
    ↓
Cari video.json dengan time = 2026-09-28
Cari foto.json  dengan time = 2026-09-28
    ↓
Tampilkan konten yang sesuai
```

Timeline tidak hanya berfungsi sebagai informasi tanggal, tetapi juga sebagai navigasi konten.

---

# 10. Filter Lokasi

Selain timeline, website memiliki filter lokasi.

Pilihan lokasi ditulis langsung di HTML, bukan dibuat secara otomatis dari JSON.

Pilihan yang tersedia:

```text
Semua
Lokasi A
Lokasi B
Lokasi C
```

Contoh HTML:

```html
<div class="location-filter">
    <button data-location="all">Semua</button>
    <button data-location="Lokasi A">Lokasi A</button>
    <button data-location="Lokasi B">Lokasi B</button>
    <button data-location="Lokasi C">Lokasi C</button>
</div>
```

JavaScript membaca nilai `lokasi` dari JSON untuk melakukan filtering.

---

# 11. Kombinasi Timeline dan Lokasi

Timeline dan filter lokasi dapat digunakan secara bersamaan.

Contoh:

```text
Tanggal  : 2026-09-28
Lokasi   : Lokasi B
```

Maka data yang ditampilkan harus memenuhi kedua kondisi:

```text
time = "2026-09-28"
AND
lokasi = "Lokasi B"
```

Contoh alur:

```text
Pengguna memilih tanggal
        ↓
Pengguna memilih lokasi
        ↓
JavaScript membaca video.json dan foto.json
        ↓
Filter berdasarkan time
        ↓
Filter berdasarkan lokasi
        ↓
Tampilkan konten yang sesuai
```

Jika lokasi yang dipilih adalah `Semua`, maka hanya filter waktu yang diterapkan.

---

# 12. Halaman `video.html`

`video.html` digunakan untuk menampilkan detail video yang dipilih dari halaman utama.

Konsep halaman:

```text
┌──────────────────────────────────────┐
│              KEMBALI                 │
├──────────────────────────────────────┤
│                                      │
│             VIDEO                    │
│          Rasio 16 : 9                │
│                                      │
├──────────────────────────────────────┤
│ Judul Video                          │
│                                      │
│ Tanggal                              │
│ Lokasi                               │
│                                      │
│ Deskripsi / cerita                   │
│                                      │
└──────────────────────────────────────┘
```

Catatan: detail desain halaman `video.html` masih dapat ditentukan kembali sebelum tahap implementasi.

---

# 13. Halaman `foto.html`

`foto.html` digunakan untuk menampilkan detail foto yang dipilih dari halaman utama.

Konsep halaman:

```text
┌──────────────────────────────────────┐
│              KEMBALI                 │
├──────────────────────────────────────┤
│                                      │
│                FOTO                  │
│                                      │
├──────────────────────────────────────┤
│ Judul Foto                           │
│                                      │
│ Tanggal                              │
│ Lokasi                               │
│                                      │
│ Deskripsi / cerita                   │
│                                      │
└──────────────────────────────────────┘
```

Catatan: detail desain halaman `foto.html` masih dapat ditentukan kembali sebelum tahap implementasi.

---

# 14. Rasio Media

Rasio media yang direncanakan:

### Video

```text
16 : 9
```

Video menggunakan rasio 16:9 agar sesuai dengan format video umum dan tetap responsive.

### Foto

```text
4 : 3
```

Foto menggunakan rasio 4:3 sebagai ukuran tampilan awal.

Rasio tersebut merupakan aturan tampilan, bukan berarti file asli harus diubah.

---

# 15. Konsep Responsive Design

Website harus dapat menyesuaikan tampilan berdasarkan ukuran layar.

Target:

```text
Desktop
   ↓
Tablet
   ↓
Mobile
```

Contoh konsep:

```text
Desktop:
┌──────────────┬──────────────┬──────────────┐
│    CARD      │    CARD      │    CARD      │
└──────────────┴──────────────┴──────────────┘

Tablet:
┌──────────────┬──────────────┐
│    CARD      │    CARD      │
└──────────────┴──────────────┘

Mobile:
┌──────────────────────────────┐
│            CARD              │
└──────────────────────────────┘
```

Ukuran container utama dapat menggunakan `max-width` agar konten tidak terlalu melebar pada layar besar.

Perkiraan awal container:

```text
max-width: 1200px
```

Nilai tersebut masih dapat disesuaikan saat proses implementasi.

---

# 16. Bootstrap

Bootstrap digunakan secara lokal.

Bootstrap tetap diletakkan di:

```text
css/bootstrap/
```

File yang digunakan:

```text
css/bootstrap/bootstrap.min.css
css/bootstrap/bootstrap.bundle.min.js
```

Bootstrap dapat digunakan untuk membantu:

- Responsive layout
- Carousel
- Komponen UI
- Grid
- Utility

Namun aturan CSS khusus website tetap berada di:

```text
css/style.css
```

---

# 17. Prinsip Data

JSON merupakan sumber data utama untuk konten.

Contoh:

```text
video.json
    ↓
JavaScript
    ↓
Video slider
    ↓
video.html
```

Dan:

```text
foto.json
    ↓
JavaScript
    ↓
Foto slider
    ↓
foto.html
```

File media tidak dimasukkan ke dalam JSON sebagai data binary. JSON hanya menyimpan path menuju file.

Contoh:

```json
"path": "video/video-001.mp4"
```

atau:

```json
"path": "images/foto-001.jpg"
```

---

# 18. Prinsip Pemisahan Tanggung Jawab

Pembagian fungsi:

```text
HTML
│
├── Struktur halaman
└── Pilihan filter lokasi yang bersifat tetap

CSS
│
├── Tampilan
├── Ukuran
├── Layout
├── Responsive
└── Animasi/tampilan visual

JavaScript
│
├── Membaca JSON
├── Carousel
├── Timeline
├── Filter lokasi
├── Navigasi detail
└── Interaksi pengguna

JSON
│
├── Data video
└── Data foto

Folder media
│
├── File video
└── File foto
```

---

# 19. Status Konsep

Bagian yang sudah ditentukan:

- Website berupa vlog/jurnal multimedia.
- Tidak menggunakan database.
- Tidak menggunakan backend.
- Data menggunakan JSON.
- Video dan foto disimpan dalam folder.
- Video dan foto memiliki JSON masing-masing.
- `lokasi` terdapat pada data video dan foto.
- Homepage memiliki video carousel.
- Homepage memiliki foto carousel.
- Homepage memiliki timeline.
- Homepage memiliki filter lokasi.
- Timeline dan lokasi dapat digunakan secara bersamaan.
- Pilihan lokasi ditulis langsung di HTML.
- Pilihan lokasi: Semua, Lokasi A, Lokasi B, Lokasi C.
- CSS menangani seluruh styling.
- JavaScript dipisah berdasarkan fitur.
- Website harus responsive.
- Bootstrap digunakan secara lokal.
- Video menggunakan rasio tampilan 16:9.
- Foto menggunakan rasio tampilan 4:3.
- `time` menggunakan format `YYYY-MM-DD`.

Bagian yang masih dapat ditentukan kemudian:

- Detail final desain `video.html`.
- Detail final desain `foto.html`.
- Detail visual timeline.
- Detail animasi carousel.
- Detail desain kartu video dan foto.
- Pembagian final file JavaScript.
- Detail responsive pada masing-masing komponen.

---

# 20. Tujuan Akhir

Website diharapkan menjadi sebuah jurnal multimedia yang memungkinkan pengguna:

1. Melihat kumpulan video.
2. Melihat kumpulan foto.
3. Menjelajahi konten berdasarkan waktu melalui timeline.
4. Menyaring konten berdasarkan lokasi.
5. Menggabungkan filter waktu dan lokasi.
6. Membuka video atau foto untuk melihat detailnya.
7. Mengakses website tanpa database dan backend.
8. Mengelola konten cukup dengan mengubah JSON dan menambahkan file media.
