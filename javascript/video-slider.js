/* =========================================================
   video-slider.js
   Tugas: membuat slider video memakai komponen Carousel Bootstrap.
   - Data awal dari window.vlog.muatVideo() (load-video.js)
   - Satu slide = satu kartu video (thumbnail 16:9)
   - Bergerak otomatis (kecuali pengguna memilih "kurangi gerakan")
   - Geser, tombol prev/next, dan indikator ditangani Bootstrap

   Dipakai file lain (filter.js):
       window.vlog.videoSlider.tampilkan(daftarVideo);
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var HALAMAN_VIDEO = "video.html"; // tujuan klik; id dikirim lewat ?id=
    var JEDA_OTOMATIS = 5000;         // milidetik antar slide

    var elCarousel = null;
    var track = null;
    var indikator = null;

    var kurangiGerakan = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    function buatKartu(video) {
        var kartu = document.createElement("a");
        kartu.className = "card kartu-video text-decoration-none shadow-sm";
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
        var judul = document.createElement("h3");
        judul.className = "h5 card-title mb-1";
        judul.textContent = video.judul;
        var info = document.createElement("p");
        info.className = "card-text small text-body-secondary mb-0";
        info.textContent = formatTanggal(video.time) + (video.lokasi ? " \u2022 " + video.lokasi : "");
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
        titik.setAttribute("aria-label", "Video ke-" + (urutan + 1));
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

    // Gambar ulang slider dengan daftar video tertentu
    function tampilkan(daftar) {
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
            pesan.textContent = "Belum ada video untuk ditampilkan.";
            slideKosong.appendChild(pesan);
            track.appendChild(slideKosong);
            aturKontrol(false);
            return;
        }

        daftar.forEach(function (video, urutan) {
            var slide = document.createElement("div");
            slide.className = "carousel-item" + (urutan === 0 ? " active" : "");
            slide.appendChild(buatKartu(video));
            track.appendChild(slide);
            indikator.appendChild(buatTitik(urutan));
        });

        var banyak = daftar.length > 1;
        aturKontrol(banyak);

        if (bisaBootstrap) {
            new bootstrap.Carousel(elCarousel, {
                ride: (banyak && !kurangiGerakan) ? "carousel" : false,
                interval: JEDA_OTOMATIS
            });
        }
    }

    function mulai() {
        elCarousel = document.getElementById("carousel-video");
        track = document.getElementById("video-track");
        indikator = document.getElementById("video-indikator");

        if (!elCarousel || !track || !indikator) {
            return;
        }

        window.vlog.muatVideo().then(tampilkan);
    }

    window.vlog.videoSlider = { tampilkan: tampilkan };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();