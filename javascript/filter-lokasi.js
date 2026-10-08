/* =========================================================
   filter-lokasi.js
   Tugas: menghidupkan tombol filter lokasi di index.html.
   - Pilihan lokasi ditulis langsung di HTML (atribut data-location)
   - Klik tombol -> tombol itu menjadi aktif, lalu filter dikirim
     ke window.vlog.filter (filter.js)
   - Nilai "all" berarti Semua lokasi
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var wadah = null;

    function tandaiAktif(tombolTerpilih) {
        var semua = wadah.querySelectorAll("[data-location]");
        for (var i = 0; i < semua.length; i++) {
            var aktif = semua[i] === tombolTerpilih;
            semua[i].classList.toggle("active", aktif);
            semua[i].setAttribute("aria-pressed", aktif ? "true" : "false");
        }
    }

    function saatKlik(peristiwa) {
        var tombol = peristiwa.target.closest("[data-location]");
        if (!tombol || !wadah.contains(tombol)) {
            return;
        }
        tandaiAktif(tombol);
        window.vlog.filter.pilihLokasi(tombol.getAttribute("data-location"));
    }

    function mulai() {
        wadah = document.getElementById("filter-lokasi");
        if (!wadah || !window.vlog.filter) {
            return;
        }
        wadah.addEventListener("click", saatKlik);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulai);
    } else {
        mulai();
    }
})();