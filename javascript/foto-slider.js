/* =========================================================
   foto-slider.js
   Tugas: membuat slider foto memakai komponen Carousel Bootstrap.
   - Data awal dari window.vlog.muatFoto() (load-foto.js)
   - Satu slide = satu baris kartu foto (thumbnail 4:3)
   - Jumlah foto per slide mengikuti breakpoint Bootstrap:
         < 768px   -> 1 foto
         768-991px -> 2 foto
         >= 992px  -> 3 foto
   - Geser, tombol prev/next, dan indikator ditangani Bootstrap

   Dipakai file lain (filter.js):
       window.vlog.fotoSlider.tampilkan(daftarFoto);
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var HALAMAN_FOTO = "foto.html"; // tujuan klik; id dikirim lewat ?id=

    var elCarousel = null;
    var track = null;
    var indikator = null;

    var daftarSekarang = []; // daftar yang sedang ditampilkan

    var mqTablet = window.matchMedia("(min-width: 768px)");
    var mqDesktop = window.matchMedia("(min-width: 992px)");

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

    function fotoPerSlide() {
        if (mqDesktop.matches) {
            return 3;
        }
        if (mqTablet.matches) {
            return 2;
        }
        return 1;
    }

    // Lebar kolom Bootstrap untuk tiap jumlah foto per slide
    function kelasKolom(perSlide) {
        return { 1: "col-12", 2: "col-6", 3: "col-4" }[perSlide];
    }

    function buatKartu(foto) {
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
        return kartu;
    }

    function buatTitik(urutan) {
        var titik = document.createElement("button");
        titik.type = "button";
        titik.setAttribute("data-bs-target", "#" + elCarousel.id);
        titik.setAttribute("data-bs-slide-to", String(urutan));
        titik.setAttribute("aria-label", "Halaman foto ke-" + (urutan + 1));
        if (urutan === 0) {
            titik.className = "active";
            titik.setAttribute("aria-current", "true");
        }
        return titik;
    }

    // Tampilkan atau sembunyikan tombol prev/next dan indikator
    function aturKontrol(tampil) {
        var tombol = elCarousel.querySelectorAll(".carousel-control-prev, .carousel-control-next");
        for (var i = 0; i < tombol.length; i++) {
            tombol[i].classList.toggle("d-none", !tampil);
        }
        indikator.classList.toggle("d-none", !tampil);
    }

    // Gambar ulang slider dengan daftar foto tertentu
    function tampilkan(daftar) {
        daftarSekarang = daftar;
        var bisaBootstrap = typeof bootstrap !== "undefined";

        // Hentikan carousel lama sebelum isinya diganti
        if (bisaBootstrap) {
            var lama = bootstrap.Carousel.getInstance(elCarousel);
            if (lama) {
                lama.dispose();
            }
        }

        track.textContent = "";
        indikator.textContent = "";

        if (daftar.length === 0) {
            var slideKosong = document.createElement("div");
            slideKosong.className = "carousel-item active";
            var pesan = document.createElement("p");
            pesan.className = "text-center text-body-secondary py-5 mb-0";
            pesan.textContent = "Belum ada foto untuk ditampilkan.";
            slideKosong.appendChild(pesan);
            track.appendChild(slideKosong);
            aturKontrol(false);
            return;
        }

        var perSlide = fotoPerSlide();
        var kolom = kelasKolom(perSlide);
        var jumlahSlide = Math.ceil(daftar.length / perSlide);

        for (var s = 0; s < jumlahSlide; s++) {
            var slide = document.createElement("div");
            slide.className = "carousel-item" + (s === 0 ? " active" : "");

            var baris = document.createElement("div");
            baris.className = "row g-3";

            daftar.slice(s * perSlide, (s + 1) * perSlide).forEach(function (foto) {
                var wadahKolom = document.createElement("div");
                wadahKolom.className = kolom;
                wadahKolom.appendChild(buatKartu(foto));
                baris.appendChild(wadahKolom);
            });

            slide.appendChild(baris);
            track.appendChild(slide);
            indikator.appendChild(buatTitik(s));
        }

        aturKontrol(jumlahSlide > 1);

        if (bisaBootstrap) {
            new bootstrap.Carousel(elCarousel, { ride: false });
        }
    }

    function mulai() {
        elCarousel = document.getElementById("carousel-foto");
        track = document.getElementById("foto-track");
        indikator = document.getElementById("foto-indikator");

        if (!elCarousel || !track || !indikator) {
            return;
        }

        // Susun ulang slide bila jumlah foto per slide berubah (ukuran layar)
        function saatBreakpointBerubah() {
            tampilkan(daftarSekarang);
        }
        mqTablet.addEventListener("change", saatBreakpointBerubah);
        mqDesktop.addEventListener("change", saatBreakpointBerubah);

        window.vlog.muatFoto().then(tampilkan);
    }

    window.vlog.fotoSlider = { tampilkan: tampilkan };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();