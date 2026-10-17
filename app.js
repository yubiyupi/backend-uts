
const express = require("express");
const db = require("./src/db");

const app = express();
const PORT = 3000;

app.use(express.json());

// Data awal untuk contoh endpoint
let students = [
  { id: 1, nama: "Andi", kelas: "XII RPL" },
  { id: 2, nama: "Budi", kelas: "XII RPL" }
];

// GET /
app.get("/", (req, res) => {
  res.send("Hello Backend!");
});

// GET /api
app.get("/api", (req, res) => {
  res.json({ message: "REST API Pertama" });
});

// GET /students - mengambil semua siswa dari database
app.get("/students", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, nama, kelas FROM students ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data siswa" });
  }
});

// GET /students/:id
app.get("/students/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, nama, kelas FROM students WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// GET /students/:id/:kelas
app.get("/students/:id/:kelas", (req, res) => {
  res.json({
    id: req.params.id,
    kelas: req.params.kelas
  });
});

// POST /students - menambah siswa ke database
app.post("/students", async (req, res) => {
  const { nama, kelas } = req.body;

  if (!nama || !kelas) {
    return res.status(400).json({
      message: "Nama dan kelas wajib diisi"
    });
  }

  try {
    const result = await db.query(
      "INSERT INTO students (nama, kelas) VALUES ($1, $2) RETURNING *",
      [nama, kelas]
    );

    res.status(201).json({
      message: "Siswa berhasil ditambahkan",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan siswa" });
  }
});

// PUT /students/:id - mengubah siswa
app.put("/students/:id", async (req, res) => {
  const { nama, kelas } = req.body;

  if (!nama || !kelas) {
    return res.status(400).json({
      message: "Nama dan kelas wajib diisi"
    });
  }

  try {
    const result = await db.query(
      `UPDATE students
       SET nama = $1, kelas = $2
       WHERE id = $3
       RETURNING *`,
      [nama, kelas, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Siswa tidak ditemukan"
      });
    }

    res.json({
      message: "Siswa berhasil diubah",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah siswa" });
  }
});

// DELETE /students/:id - menghapus siswa
app.delete("/students/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Siswa tidak ditemukan"
      });
    }

    res.json({ message: "Siswa berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus siswa" });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
