
"use strict";

let daftarDataProyek = [
    {
        id: 202601,
        judul: "Web Interaktif UMKM",
        kategori: "Web App",
        anggaran: 1500000,
        selesai: false
    },
    {
        id: 202602,
        judul: "Manajemen Data Warga",
        kategori: "Web App",
        anggaran: 1000000,
        selesai: false
    }
];

const formProyek = document.getElementById("formProyek");
const inputJudul = document.getElementById("judulProyek");
const inputKategori = document.getElementById("kategoriProyek");
const inputAnggaran = document.getElementById("anggaranProyek");
const inputStatus = document.getElementById("statusProyek");
const inputPencarian = document.getElementById("pencarianProyek");
const daftarProyek = document.getElementById("daftarProyek");
const pesanForm = document.getElementById("pesanForm");

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

function tampilkanPesan(pesan, berhasil = false) {
    pesanForm.textContent = pesan;
    pesanForm.classList.toggle("berhasil", berhasil);
}

function renderStatistik() {
    const total = daftarDataProyek.length;

    const selesai = daftarDataProyek.filter(
        proyek => proyek.selesai
    ).length;

    const berjalan = total - selesai;

    const totalAnggaran = daftarDataProyek.reduce(
        (jumlah, proyek) => jumlah + proyek.anggaran,
        0
    );

    document.getElementById("totalProyek").textContent = total;
    document.getElementById("proyekBerjalan").textContent = berjalan;
    document.getElementById("proyekSelesai").textContent = selesai;
    document.getElementById("totalAnggaran").textContent =
        formatRupiah(totalAnggaran);
}

function renderProyek() {
    const kataKunci = inputPencarian.value.trim().toLowerCase();

    const proyekDitampilkan = daftarDataProyek.filter(proyek =>
        proyek.judul.toLowerCase().includes(kataKunci)
    );

    daftarProyek.replaceChildren();

    if (proyekDitampilkan.length === 0) {
        const pesanKosong = document.createElement("p");
        pesanKosong.className = "pesan-kosong";
        pesanKosong.textContent = kataKunci
            ? "Proyek tidak ditemukan."
            : "Belum ada proyek. Silakan tambahkan proyek baru.";

        daftarProyek.appendChild(pesanKosong);
    }

    proyekDitampilkan.forEach(proyek => {
        const kartu = document.createElement("article");
        kartu.className = "kartu-proyek";

        const judul = document.createElement("h3");
        judul.textContent = proyek.judul;

        const kategori = document.createElement("p");
        kategori.className = "kategori-proyek";
        kategori.textContent = proyek.kategori;

        const anggaran = document.createElement("p");
        anggaran.className = "anggaran-proyek";
        anggaran.textContent =
            "Estimasi Anggaran: " + formatRupiah(proyek.anggaran);

        const status = document.createElement("p");
        status.className = proyek.selesai
            ? "status-proyek selesai"
            : "status-proyek berjalan";

        status.textContent = proyek.selesai
            ? "Status: Selesai"
            : "Status: Dalam Pengerjaan";

        const tombolStatus = document.createElement("button");
        tombolStatus.type = "button";
        tombolStatus.className = "tombol-komik";
        tombolStatus.textContent = proyek.selesai
            ? "Ubah ke Dalam Pengerjaan"
            : "Ubah Status";

        tombolStatus.addEventListener("click", () => {
            ubahStatusProyek(proyek.id);
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.className = "tombol-hapus";
        tombolHapus.textContent = "Hapus Proyek";

        tombolHapus.addEventListener("click", () => {
            hapusProyek(proyek.id);
        });

        kartu.append(
            judul,
            kategori,
            anggaran,
            status,
            tombolStatus,
            tombolHapus
        );

        daftarProyek.appendChild(kartu);
    });

    renderStatistik();
}

formProyek.addEventListener("submit", function (e) {
    e.preventDefault();

    const judul = inputJudul.value.trim();
    const kategori = inputKategori.value;
    const anggaran = Number(inputAnggaran.value);
    const selesai = inputStatus.checked;

    if (judul === "") {
        tampilkanPesan("Judul proyek tidak boleh kosong.");
        inputJudul.focus();
        return;
    }

    if (
        inputAnggaran.value.trim() === "" ||
        !Number.isFinite(anggaran) ||
        anggaran <= 0
    ) {
        tampilkanPesan(
            "Anggaran harus berupa angka yang lebih besar dari 0."
        );
        inputAnggaran.focus();
        return;
    }

    const proyekBaru = {
        id: Date.now(),
        judul: judul,
        kategori: kategori,
        anggaran: anggaran,
        selesai: selesai
    };

    daftarDataProyek = [...daftarDataProyek, proyekBaru];

    formProyek.reset();
    tampilkanPesan("Proyek berhasil ditambahkan!", true);

    renderProyek();
});

inputPencarian.addEventListener("input", function () {
    renderProyek();
});

function ubahStatusProyek(id) {
    daftarDataProyek = daftarDataProyek.map(proyek => {
        if (proyek.id === id) {
            return {
                ...proyek,
                selesai: !proyek.selesai
            };
        }

        return proyek;
    });

    renderProyek();
}

function hapusProyek(id) {
    daftarDataProyek = daftarDataProyek.filter(
        proyek => proyek.id !== id
    );

    renderProyek();
}

renderProyek();
