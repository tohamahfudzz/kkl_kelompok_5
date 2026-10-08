/* =========================================================
   foto-grid.js
   Tugas: menampilkan kartu foto di bagian "Foto" index.html.
   - Maksimal 3 kartu (JUMLAH_TAMPIL), yang terbaru lebih dulu
   - Data awal dari window.vlog.muatFoto() (load-foto.js)
   - Kartu memakai komponen Card Bootstrap, foto 4:3

   Dipakai file lain (filter.js):
       window.vlog.fotoGrid.tampilkan(daftarFoto);
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var HALAMAN_FOTO = "foto.html"; // tujuan klik; id dikirim lewat ?id=
    var JUMLAH_TAMPIL = 3;

    var grid = null;

    // "2026-09-28" -> "28 September 2026" (tanpa masalah zona waktu)
    function formatTanggal(teks) {
        var bagian = teks.split("-");
        if (bagian.length !== 3) {
            return teks;
        }
        var tanggal = new Date(Number(bagian[0]), Number(bagian[1]) - 1, Number(bagian[2]));
        return tanggal.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    function buatKolom(foto) {
        var kolom = document.createElement("div");
        kolom.className = "col";

        var kartu = document.createElement("a");
        kartu.className = "card h-100 kartu-foto text-decoration-none shadow-sm";
        kartu.href = HALAMAN_FOTO + "?id=" + encodeURIComponent(foto.id);
        kartu.setAttribute("aria-label", "Buka foto: " + foto.judul);

        var media = document.createElement("div");
        media.className = "ratio ratio-4x3 kartu-media";
        var gambar = document.createElement("img");
        gambar.className = "object-fit-cover";
        gambar.src = foto.path;
        gambar.alt = foto.judul;
        gambar.loading = "lazy";
        media.appendChild(gambar);

        var isi = document.createElement("div");
        isi.className = "card-body";
        var judul = document.createElement("h3");
        judul.className = "h6 card-title mb-1";
        judul.textContent = foto.judul;
        var info = document.createElement("p");
        info.className = "card-text small text-body-secondary mb-0";
        info.textContent = formatTanggal(foto.time) + (foto.lokasi ? " \u2022 " + foto.lokasi : "");
        isi.appendChild(judul);
        isi.appendChild(info);

        kartu.appendChild(media);
        kartu.appendChild(isi);
        kolom.appendChild(kartu);
        return kolom;
    }

    function tampilkan(daftar) {
        grid.textContent = "";

        // Data terurut dari lama ke baru, jadi ambil dari belakang
        var terbaru = daftar.slice().reverse().slice(0, JUMLAH_TAMPIL);

        if (terbaru.length === 0) {
            var kolom = document.createElement("div");
            kolom.className = "col-12";
            var pesan = document.createElement("p");
            pesan.className = "text-center text-body-secondary py-4 mb-0";
            pesan.textContent = "Belum ada foto untuk ditampilkan.";
            kolom.appendChild(pesan);
            grid.appendChild(kolom);
            return;
        }

        terbaru.forEach(function (foto) {
            grid.appendChild(buatKolom(foto));
        });
    }

    function mulai() {
        grid = document.getElementById("foto-grid");
        if (!grid) {
            return;
        }
        window.vlog.muatFoto().then(tampilkan);
    }

    window.vlog.fotoGrid = { tampilkan: tampilkan };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();