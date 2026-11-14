
// File: public/script.js
// Logika Client-Side JavaScript CRUD
// + Real-Time Search
// + Validasi NIM Duplikat
// + Counter Total Mahasiswa

document.addEventListener("DOMContentLoaded", () => {

    // 1. Tangkap Elemen DOM
    const mhsForm = document.querySelector("#mhsForm");
    const mhsIdInput = document.querySelector("#mhsId");
    const nimInput = document.querySelector("#nim");
    const namaInput = document.querySelector("#nama");
    const jurusanInput = document.querySelector("#jurusan");
    const emailInput = document.querySelector("#email");

    const btnSubmit = document.querySelector("#btnSubmit");
    const btnCancel = document.querySelector("#btnCancel");
    const formTitle = document.querySelector("#formTitle");

    const mhsTableBody = document.querySelector("#mhsTableBody");
    const alertMessage = document.querySelector("#alertMessage");

    // Elemen Fitur Tambahan
    const searchInput = document.querySelector("#searchInput");
    const totalMahasiswa = document.querySelector("#totalMahasiswa");

    let listMahasiswa = [];

    // Fungsi Pembantu Notifikasi
    const showAlert = (text, type = "success") => {

        alertMessage.textContent = text;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.style.display = "block";

        setTimeout(() => {
            alertMessage.style.display = "none";
        }, 3000);

    };

    // 2. READ: Mengambil Data Mahasiswa dari API
    const loadMahasiswa = async () => {

        try {

            const res = await fetch("/api/mahasiswa");

            if (!res.ok) {
                throw new Error("Gagal mengambil data mahasiswa");
            }

            listMahasiswa = await res.json();

            // Perbarui Counter
            updateCounter();

            // Tampilkan Data
            filterMahasiswa();

        } catch (err) {

            showAlert(
                "Gagal memuat data dari server backend",
                "error"
            );

        }

    };

    // 3. FITUR 3: Counter Total Mahasiswa
    const updateCounter = () => {

        totalMahasiswa.textContent = listMahasiswa.length;

    };

    // 4. Fungsi Menampilkan Data ke Tabel
    const renderTable = (data) => {

        mhsTableBody.innerHTML = "";

        if (data.length === 0) {

            mhsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#64748b;">
                        Data mahasiswa tidak ditemukan.
                    </td>
                </tr>
            `;

            return;

        }

        data.forEach((mhs, idx) => {

            const tr = document.createElement("tr");

            // Membuat isi tabel
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <button
                        class="btn-action btn-edit"
                        data-id="${mhs.id}">
                        Edit
                    </button>

                    <button
                        class="btn-action btn-delete"
                        data-id="${mhs.id}">
                        Hapus
                    </button>
                </td>
            `;

            // Menampilkan data teks secara aman
            const cells = tr.querySelectorAll("td");

            cells[1].textContent = mhs.nim;
            cells[2].textContent = mhs.nama;
            cells[3].textContent = mhs.jurusan;
            cells[4].textContent = mhs.email;

            mhsTableBody.appendChild(tr);

        });

    };

    // 5. FITUR 1: Pencarian Real-Time
    const filterMahasiswa = () => {

        const keyword = searchInput.value.toLowerCase().trim();

        const filteredData = listMahasiswa.filter((mhs) => {

            return (
                String(mhs.nim).toLowerCase().includes(keyword) ||
                String(mhs.nama).toLowerCase().includes(keyword) ||
                String(mhs.jurusan).toLowerCase().includes(keyword) ||
                String(mhs.email).toLowerCase().includes(keyword)
            );

        });

        renderTable(filteredData);

    };

    // Event Listener Pencarian
    searchInput.addEventListener("input", filterMahasiswa);

    // 6. CREATE & UPDATE: Submit Formulir
    mhsForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const payload = {
            nim: nimInput.value.trim(),
            nama: namaInput.value.trim(),
            jurusan: jurusanInput.value,
            email: emailInput.value.trim()
        };

        const id = mhsIdInput.value;
        const isEdit = Boolean(id);

        // 7. FITUR 2: Validasi NIM Duplikat dengan .some()
        const nimSudahAda = listMahasiswa.some((mhs) => {

            const nimSama =
                String(mhs.nim).toLowerCase() === payload.nim.toLowerCase();

            // Mengecualikan data yang sedang diedit
            const mahasiswaBerbeda =
                String(mhs.id) !== String(id);

            return nimSama && mahasiswaBerbeda;

        });

        // Jika NIM sudah digunakan
        if (nimSudahAda) {

            showAlert("NIM sudah terdaftar!", "error");

            return;

        }

        // Menentukan URL dan Method
        const url = isEdit
            ? `/api/mahasiswa/${id}`
            : "/api/mahasiswa";

        const method = isEdit ? "PUT" : "POST";

        try {

            const res = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            const result = await res.json();

            if (!res.ok || !result.success) {

                showAlert(
                    result.message || "Terjadi kesalahan saat menyimpan data",
                    "error"
                );

                return;

            }

            showAlert(result.message);

            resetForm();

            // Memperbarui tabel dan counter
            await loadMahasiswa();

        } catch (err) {

            showAlert(
                "Gagal mengirim data ke server",
                "error"
            );

        }

    });

    // 8. DELETE & EDIT: Event Delegation
    mhsTableBody.addEventListener("click", async (e) => {

        const tombol = e.target.closest("button[data-id]");

        if (!tombol || !mhsTableBody.contains(tombol)) {
            return;
        }

        const id = Number(tombol.dataset.id);

        if (!id) {
            return;
        }

        // MODE EDIT
        if (tombol.classList.contains("btn-edit")) {

            const targetMhs = listMahasiswa.find(
                m => Number(m.id) === id
            );

            if (targetMhs) {

                mhsIdInput.value = targetMhs.id;
                nimInput.value = targetMhs.nim;
                namaInput.value = targetMhs.nama;
                jurusanInput.value = targetMhs.jurusan;
                emailInput.value = targetMhs.email;

                formTitle.textContent = "Edit Data Mahasiswa";

                btnSubmit.textContent = "Perbarui Mahasiswa";

                btnCancel.style.display = "inline-block";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }

        // MODE DELETE
        else if (tombol.classList.contains("btn-delete")) {

            if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {

                try {

                    const res = await fetch(
                        `/api/mahasiswa/${id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    const result = await res.json();

                    if (!res.ok || !result.success) {

                        showAlert(
                            result.message || "Gagal menghapus data",
                            "error"
                        );

                        return;

                    }

                    showAlert(result.message);

                    // Memperbarui tabel dan counter
                    await loadMahasiswa();

                } catch (err) {

                    showAlert(
                        "Gagal menghapus data dari server",
                        "error"
                    );

                }

            }

        }

    });

    // 9. Reset Form ke Mode Tambah
    const resetForm = () => {

        mhsForm.reset();

        mhsIdInput.value = "";

        formTitle.textContent = "Tambah Mahasiswa Baru";

        btnSubmit.textContent = "Simpan Mahasiswa";

        btnCancel.style.display = "none";

    };

    // Event Tombol Batal Edit
    btnCancel.addEventListener("click", resetForm);

    // 10. Mengambil Data Mahasiswa Pertama Kali
    loadMahasiswa();

});