/* =========================================================
   detail-foto.js
   Tugas: mengisi halaman foto.html. Ada dua mode:
   - Tanpa id (foto.html)       -> daftar semua foto (terbaru dulu)
   - Dengan id (foto.html?id=2) -> detail foto yang dipilih
   - Id tidak ditemukan         -> pesan, lalu tetap tampil daftar
   Data dari window.vlog.muatFoto() (load-foto.js)
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var HALAMAN_FOTO = "foto.html";
    var TANDA_KOSONG = "-"; // dipakai jika sebuah field tidak ada di JSON

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

    function ambilId() {
        return new URLSearchParams(window.location.search).get("id");
    }

    function teksAtauKosong(nilai) {
        return typeof nilai === "string" && nilai.trim() !== "" ? nilai : TANDA_KOSONG;
    }

    function el(id) {
        return document.getElementById(id);
    }

    function tampilkanPesan(pesan) {
        var elPesan = el("detail-pesan");
        elPesan.textContent = pesan;
        elPesan.hidden = false;
    }

    function sembunyikanPesan() {
        el("detail-pesan").hidden = true;
    }

    // ---------- Mode daftar ----------

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
        var judul = document.createElement("h2");
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

    function tampilkanDaftar(daftar) {
        var grid = el("daftar-foto-grid");
        grid.textContent = "";

        // Data terurut dari lama ke baru, jadi balik agar terbaru dulu
        daftar.slice().reverse().forEach(function (foto) {
            grid.appendChild(buatKolom(foto));
        });

        if (daftar.length === 0) {
            tampilkanPesan("Belum ada foto untuk ditampilkan.");
        }

        el("daftar-foto").hidden = daftar.length === 0;
        document.title = "Semua Foto - My Vlog";
    }

    // ---------- Mode detail ----------

    function tampilkanDetail(foto) {
        var elFoto = el("detail-foto");
        elFoto.src = foto.path;
        elFoto.alt = foto.judul;

        el("detail-judul").textContent = foto.judul;
        el("detail-tanggal").textContent = formatTanggal(foto.time);
        el("detail-lokasi").textContent = teksAtauKosong(foto.lokasi);
        el("detail-deskripsi").textContent = teksAtauKosong(foto.deskripsi);

        document.querySelector(".detail-media").hidden = false;
        el("detail-teks").hidden = false;
        document.title = foto.judul + " - My Vlog";
    }

    function cariFoto(daftar, id) {
        for (var i = 0; i < daftar.length; i++) {
            if (String(daftar[i].id) === id) {
                return daftar[i];
            }
        }
        return null;
    }

    function mulai() {
        var id = ambilId();

        window.vlog.muatFoto().then(function (daftar) {
            sembunyikanPesan();

            if (id === null || id === "") {
                tampilkanDaftar(daftar);
                return;
            }

            var ditemukan = cariFoto(daftar, id);
            if (ditemukan) {
                tampilkanDetail(ditemukan);
                return;
            }

            // Id tidak ada: beri tahu, lalu tetap tampilkan daftar
            tampilkanDaftar(daftar);
            tampilkanPesan("Foto tidak ditemukan. Pilih salah satu foto di bawah ini.");
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();