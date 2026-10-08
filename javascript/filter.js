/* =========================================================
   filter.js
   Tugas: satu tempat untuk filter konten di halaman utama.
   - Menyimpan tanggal (dari timeline) dan lokasi (dari tombol lokasi)
   - Menyaring video dan foto: tanggal DAN lokasi harus cocok
   - Lokasi "all" (Semua) = hanya filter tanggal yang berlaku
   - Hasilnya dikirim ke grid video dan grid foto (maksimal 3 kartu
     masing-masing; carousel utama tidak ikut difilter)

   Dipakai file lain:
       window.vlog.filter.pilihTanggal("2026-09-28"); // atau null
       window.vlog.filter.pilihLokasi("Lokasi B");    // atau "all"
   ========================================================= */

(function () {
    "use strict";

    window.vlog = window.vlog || {};

    var LOKASI_SEMUA = "all";

    var status = {
        tanggal: null,
        lokasi: LOKASI_SEMUA
    };

    // Samakan bentuk teks agar "Lokasi A" dan " lokasi a " dianggap sama
    function normal(teks) {
        return String(teks || "").trim().toLowerCase();
    }

    function cocok(item) {
        var cocokTanggal = !status.tanggal || item.time === status.tanggal;
        var cocokLokasi = status.lokasi === LOKASI_SEMUA ||
            normal(item.lokasi) === normal(status.lokasi);
        return cocokTanggal && cocokLokasi;
    }

    // Saring data lalu kirim ke kedua slider
    function terapkan() {
        Promise.all([window.vlog.muatVideo(), window.vlog.muatFoto()])
            .then(function (hasil) {
                if (window.vlog.videoGrid) {
                    window.vlog.videoGrid.tampilkan(hasil[0].filter(cocok));
                }
                if (window.vlog.fotoGrid) {
                    window.vlog.fotoGrid.tampilkan(hasil[1].filter(cocok));
                }
            });
    }

    function pilihTanggal(tanggal) {
        status.tanggal = tanggal || null;
        terapkan();
    }

    function pilihLokasi(lokasi) {
        status.lokasi = lokasi || LOKASI_SEMUA;
        terapkan();
    }

    function ambil() {
        return { tanggal: status.tanggal, lokasi: status.lokasi };
    }

    window.vlog.filter = {
        pilihTanggal: pilihTanggal,
        pilihLokasi: pilihLokasi,
        ambil: ambil
    };
})();