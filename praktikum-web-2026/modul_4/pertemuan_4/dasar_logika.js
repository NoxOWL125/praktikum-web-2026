// File: dasar_logika
// Prak Dasar Sintak, Tipe Data, dan Arrow

const namaProgrammer = "MNashrullMF"
const tahunMulai = 2022;
const tahunSekarang = new Date().getFullYear();

// Fungsi Arrow untuk menghitung masa pengalaman
const hitungPengalaman = (mulai, sekarang) => sekarang - mulai;
const masaKerja = hitungPengalaman(tahunMulai, tahunSekarang);

// Evaluasi kondisi dengan ternary operator
const statusSenioritas = masaKerja >= 2 ? "Mid-Level Developer" : "Junior Developer";

console.log ("======Informasi Pengembang=====")
console.log(`Nama               :${namaProgrammer}`);
console.log(`Pengalaman         :${masaKerja} tahun`);
console.log(`Ketegori           :${statusSenioritas}`);

// Pengujian Strict Equiality vs Loose Equality
console.log("\n===Uji Perbandingan Tipe Data===");
console.log("10 == '10' :", 10 == '10');
console.log("10 === '10 :", 10 === '10');
console.log("Tipe 10    :", typeof 10);
console.log("Tipe '10'  :", typeof '10');