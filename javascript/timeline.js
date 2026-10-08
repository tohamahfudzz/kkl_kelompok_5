/* =========================================================
   timeline.js
   Tugas: membuat timeline dari nilai "time" pada video.json
   dan foto.json, lalu memfilter slider video dan slider foto
   sesuai tanggal yang dipilih.

   - Satu titik = satu tanggal unik (gabungan video dan foto)
   - Klik titik     -> kedua slider hanya menampilkan tanggal itu
   - Klik titik aktif lagi -> kembali menampilkan semua konten
   - Bisa dipanggil dari file lain:
         window.vlog.timeline.pilih("2026-09-28");
         window.vlog.timeline.pilih(null); // semua konten
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var wadah = null;
    var tanggalAktif = null;

    // "2026-09-28" -> "28 Sep 2026" (tanpa masalah zona waktu)
    function formatTanggal(teks) {
        var bagian = teks.split("-");
        if (bagian.length !== 3) {
            return teks;
        }
        var tanggal = new Date(Number(bagian[0]), Number(bagian[1]) - 1, Number(bagian[2]));
        return tanggal.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // Gabungkan semua nilai time dari video dan foto, tanpa duplikat, terurut
    function kumpulkanTanggal(daftarVideo, daftarFoto) {
        var ada = {};
        daftarVideo.concat(daftarFoto).forEach(function (item) {
            ada[item.time] = true;
        });
        return Object.keys(ada).sort();
    }

    // Kirim tanggal ke filter.js (yang menggabungkannya dengan filter lokasi)
    function terapkanKeSlider(tanggal) {
        if (window.vlog.filter) {
            window.vlog.filter.pilihTanggal(tanggal);
        }
    }

    function tandaiAktif() {
        var daftar = wadah.querySelectorAll(".timeline-item");
        for (var i = 0; i < daftar.length; i++) {
            var cocok = daftar[i].getAttribute("data-time") === tanggalAktif;
            daftar[i].classList.toggle("aktif", cocok);
            daftar[i].setAttribute("aria-pressed", cocok ? "true" : "false");
        }
    }

    function pilih(tanggal) {
        tanggalAktif = tanggal || null;
        tandaiAktif();
        terapkanKeSlider(tanggalAktif);
    }

    function buatItem(tanggal) {
        var tombol = document.createElement("button");
        tombol.type = "button";
        tombol.className = "timeline-item";
        tombol.setAttribute("data-time", tanggal);
        tombol.setAttribute("aria-pressed", "false");

        var titik = document.createElement("span");
        titik.className = "timeline-titik";
        titik.setAttribute("aria-hidden", "true");

        var label = document.createElement("span");
        label.className = "timeline-label";
        label.textContent = formatTanggal(tanggal);

        tombol.appendChild(titik);
        tombol.appendChild(label);

        tombol.addEventListener("click", function () {
            // Klik titik yang sedang aktif = batalkan filter
            pilih(tanggalAktif === tanggal ? null : tanggal);
        });

        return tombol;
    }

    function gambar(daftarTanggal) {
        wadah.textContent = "";

        if (daftarTanggal.length === 0) {
            var kosong = document.createElement("p");
            kosong.className = "slider-kosong";
            kosong.textContent = "Belum ada tanggal untuk ditampilkan.";
            wadah.appendChild(kosong);
            return;
        }

        daftarTanggal.forEach(function (tanggal) {
            wadah.appendChild(buatItem(tanggal));
        });
    }

    function mulai() {
        wadah = document.getElementById("timeline");
        if (!wadah) {
            return;
        }

        Promise.all([window.vlog.muatVideo(), window.vlog.muatFoto()])
            .then(function (hasil) {
                gambar(kumpulkanTanggal(hasil[0], hasil[1]));
            });
    }

    window.vlog.timeline = { pilih: pilih };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();