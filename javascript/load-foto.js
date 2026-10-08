/* =========================================================
   load-foto.js
   Tugas: memuat data foto dari json/foto.json.
   Tidak menggambar apa pun ke halaman (itu tugas foto-slider.js).

   Cara pakai dari file JavaScript lain:
       window.vlog.muatFoto().then(function (daftarFoto) { ... });
   ========================================================= */

(function () {
    "use strict";

    // Namespace bersama untuk semua file JavaScript project ini
    window.vlog = window.vlog || {};

    var URL_FOTO = "json/foto.json";
    var cache = null; // promise hasil muat, supaya JSON hanya diambil sekali

    // Urutkan dari tanggal paling lama ke paling baru, lalu berdasarkan id
    function urutkan(daftar) {
        return daftar.slice().sort(function (a, b) {
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;
            return a.id - b.id;
        });
    }

    // Pastikan setiap item punya field yang dibutuhkan
    function valid(item) {
        return item &&
            typeof item.judul === "string" &&
            typeof item.path === "string" &&
            typeof item.time === "string";
    }

    function muatFoto() {
        if (cache) {
            return cache;
        }

        cache = fetch(URL_FOTO)
            .then(function (respons) {
                if (!respons.ok) {
                    throw new Error("HTTP " + respons.status);
                }
                return respons.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) {
                    throw new Error("foto.json harus berupa array");
                }
                return urutkan(data.filter(valid));
            })
            .catch(function (galat) {
                console.error("Gagal memuat " + URL_FOTO + ":", galat);
                return []; // slider akan menampilkan keadaan kosong
            });

        return cache;
    }

    window.vlog.muatFoto = muatFoto;
})();