
// File: server.js
// Backend Node.js Express & MySQL
// Aplikasi CRUD Mahasiswa

const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON dan menyajikan file statis frontend
app.use(express.json());
app.use(express.static('public'));

// 1. Koneksi ke Database MySQL Laragon
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Password default MySQL Laragon kosong
    database: 'db_kampus'
});

// Mengecek koneksi database
db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal:', err.message);
        return;
    }

    console.log('Terhubung ke database MySQL Laragon');
});

// 2. READ: Mengambil seluruh data mahasiswa
// Indikator 5.3 dan 6.2
app.get('/api/mahasiswa', (req, res) => {

    db.query(
        'SELECT * FROM mahasiswa ORDER BY id DESC',
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(results);

        }
    );

});

// 3. CREATE: Menambahkan mahasiswa baru
app.post('/api/mahasiswa', (req, res) => {

    const { nim, nama, jurusan, email } = req.body;

    const sql = `
        INSERT INTO mahasiswa (nim, nama, jurusan, email)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nim, nama, jurusan, email], (err, result) => {

        if (err) {

            // Menangani NIM duplikat dari database
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'NIM sudah terdaftar!'
                });
            }

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({
            success: true,
            message: 'Data mahasiswa berhasil disimpan!'
        });

    });

});

// 4. UPDATE: Mengubah data mahasiswa
app.put('/api/mahasiswa/:id', (req, res) => {

    const { id } = req.params;
    const { nim, nama, jurusan, email } = req.body;

    const sql = `
        UPDATE mahasiswa
        SET nim = ?, nama = ?, jurusan = ?, email = ?
        WHERE id = ?
    `;

    db.query(sql, [nim, nama, jurusan, email, id], (err, result) => {

        if (err) {

            // Menangani NIM duplikat saat update
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'NIM sudah terdaftar!'
                });
            }

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data mahasiswa tidak ditemukan!'
            });
        }

        res.json({
            success: true,
            message: 'Data mahasiswa berhasil diperbarui!'
        });

    });

});

// 5. DELETE: Menghapus data mahasiswa
app.delete('/api/mahasiswa/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM mahasiswa WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Data mahasiswa tidak ditemukan!'
                });
            }

            res.json({
                success: true,
                message: 'Data mahasiswa berhasil dihapus!'
            });

        }
    );

});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server CRUD aktif di http://localhost:${PORT}`);
});
