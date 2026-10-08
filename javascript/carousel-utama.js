/* =========================================================
   carousel-utama.js
   Tugas: carousel besar di bagian atas index.html.
   - Hanya 3 slide (JUMLAH_SLIDE)
   - Isi: 3 foto terbaru dari window.vlog.muatFoto()
   - Berjalan otomatis (JEDA_OTOMATIS milidetik per slide)
   - Tidak terpengaruh filter timeline dan lokasi
   - Geser, tombol prev/next, dan indikator ditangani Bootstrap
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var HALAMAN_FOTO = "foto.html"; // tujuan klik; id dikirim lewat ?id=
    var JUMLAH_SLIDE = 3;
    var JEDA_OTOMATIS = 5000;       // milidetik antar slide

    var elCarousel = null;
    var track = null;
    var indikator = null;

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

    function buatSlide(foto, urutan) {
        var slide = document.createElement("div");
        slide.className = "carousel-item" + (urutan === 0 ? " active" : "");

        var tautan = document.createElement("a");
        tautan.className = "hero-slide d-block";
        tautan.href = HALAMAN_FOTO + "?id=" + encodeURIComponent(foto.id);
        tautan.setAttribute("aria-label", "Buka foto: " + foto.judul);

        var media = document.createElement("div");
        media.className = "ratio hero-media";
        var gambar = document.createElement("img");
        gambar.className = "object-fit-cover";
        gambar.src = foto.path;
        gambar.alt = foto.judul;
        media.appendChild(gambar);

        var keterangan = document.createElement("div");
        keterangan.className = "carousel-caption";
        var judul = document.createElement("h2");
        judul.className = "hero-judul h4 mb-1";
        judul.textContent = foto.judul;
        var info = document.createElement("p");
        info.className = "small mb-0";
        info.textContent = formatTanggal(foto.time) + (foto.lokasi ? " \u2022 " + foto.lokasi : "");
        keterangan.appendChild(judul);
        keterangan.appendChild(info);

        tautan.appendChild(media);
        tautan.appendChild(keterangan);
        slide.appendChild(tautan);
        return slide;
    }

    function buatTitik(urutan) {
        var titik = document.createElement("button");
        titik.type = "button";
        titik.setAttribute("data-bs-target", "#" + elCarousel.id);
        titik.setAttribute("data-bs-slide-to", String(urutan));
        titik.setAttribute("aria-label", "Slide ke-" + (urutan + 1));
        if (urutan === 0) {
            titik.className = "active";
            titik.setAttribute("aria-current", "true");
        }
        return titik;
    }

    function aturKontrol(tampil) {
        var tombol = elCarousel.querySelectorAll(".carousel-control-prev, .carousel-control-next");
        for (var i = 0; i < tombol.length; i++) {
            tombol[i].classList.toggle("d-none", !tampil);
        }
        indikator.classList.toggle("d-none", !tampil);
    }

    function gambar(daftar) {
        var bisaBootstrap = typeof bootstrap !== "undefined";

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

        daftar.forEach(function (foto, urutan) {
            track.appendChild(buatSlide(foto, urutan));
            indikator.appendChild(buatTitik(urutan));
        });

        var banyak = daftar.length > 1;
        aturKontrol(banyak);

        if (bisaBootstrap) {
            new bootstrap.Carousel(elCarousel, {
                ride: banyak ? "carousel" : false,
                interval: JEDA_OTOMATIS
            });
        }
    }

    function mulai() {
        elCarousel = document.getElementById("carousel-utama");
        track = document.getElementById("hero-track");
        indikator = document.getElementById("hero-indikator");

        if (!elCarousel || !track || !indikator) {
            return;
        }

        window.vlog.muatFoto().then(function (daftar) {
            // Data terurut dari lama ke baru, jadi ambil dari belakang
            var terbaru = daftar.slice().reverse().slice(0, JUMLAH_SLIDE);
            gambar(terbaru);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();