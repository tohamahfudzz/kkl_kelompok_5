/* =========================================================
   detail-video.js
   Tugas: mengisi halaman video.html. Ada dua mode:
   - Tanpa id (video.html)      -> daftar semua video (terbaru dulu)
   - Dengan id (video.html?id=2) -> detail video yang dipilih
   - Id tidak ditemukan          -> pesan, lalu tetap tampil daftar
   Data dari window.vlog.muatVideo() (load-video.js)
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var HALAMAN_VIDEO = "video.html";
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

    function buatKolom(video) {
        var kolom = document.createElement("div");
        kolom.className = "col";

        var kartu = document.createElement("a");
        kartu.className = "card h-100 kartu-video text-decoration-none shadow-sm";
        kartu.href = HALAMAN_VIDEO + "?id=" + encodeURIComponent(video.id);
        kartu.setAttribute("aria-label", "Buka video: " + video.judul);

        var media = document.createElement("div");
        media.className = "ratio ratio-16x9 kartu-media";
        var gambar = document.createElement("img");
        gambar.className = "object-fit-cover";
        gambar.src = video.thumbnail;
        gambar.alt = "Thumbnail video " + video.judul;
        gambar.loading = "lazy";
        media.appendChild(gambar);

        var isi = document.createElement("div");
        isi.className = "card-body";
        var judul = document.createElement("h2");
        judul.className = "h6 card-title mb-1";
        judul.textContent = video.judul;
        var info = document.createElement("p");
        info.className = "card-text small text-body-secondary mb-0";
        info.textContent = formatTanggal(video.time) + (video.lokasi ? " \u2022 " + video.lokasi : "");
        isi.appendChild(judul);
        isi.appendChild(info);

        kartu.appendChild(media);
        kartu.appendChild(isi);
        kolom.appendChild(kartu);
        return kolom;
    }

    function tampilkanDaftar(daftar) {
        var grid = el("daftar-video-grid");
        grid.textContent = "";

        // Data terurut dari lama ke baru, jadi balik agar terbaru dulu
        daftar.slice().reverse().forEach(function (video) {
            grid.appendChild(buatKolom(video));
        });

        if (daftar.length === 0) {
            tampilkanPesan("Belum ada video untuk ditampilkan.");
        }

        el("daftar-video").hidden = daftar.length === 0;
        document.title = "Semua Video - My Vlog";
    }

    // ---------- Mode detail ----------

    function tampilkanDetail(video) {
        var elVideo = el("detail-video");
        elVideo.src = video.path;
        elVideo.poster = video.thumbnail;

        el("detail-judul").textContent = video.judul;
        el("detail-tanggal").textContent = formatTanggal(video.time);
        el("detail-lokasi").textContent = teksAtauKosong(video.lokasi);
        el("detail-deskripsi").textContent = teksAtauKosong(video.deskripsi);

        document.querySelector(".detail-media").hidden = false;
        el("detail-teks").hidden = false;
        document.title = video.judul + " - My Vlog";
    }

    function cariVideo(daftar, id) {
        for (var i = 0; i < daftar.length; i++) {
            if (String(daftar[i].id) === id) {
                return daftar[i];
            }
        }
        return null;
    }

    function mulai() {
        var id = ambilId();

        window.vlog.muatVideo().then(function (daftar) {
            sembunyikanPesan();

            if (id === null || id === "") {
                tampilkanDaftar(daftar);
                return;
            }

            var ditemukan = cariVideo(daftar, id);
            if (ditemukan) {
                tampilkanDetail(ditemukan);
                return;
            }

            // Id tidak ada: beri tahu, lalu tetap tampilkan daftar
            tampilkanDaftar(daftar);
            tampilkanPesan("Video tidak ditemukan. Pilih salah satu video di bawah ini.");
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();