const { verifyToken } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ============================================================
// GET /api/movies/:id — Ambil satu film by ID (SELECT + WHERE)
// ============================================================
router.get('/', verifyToken, async (req, res) => {
  try {
    const { type, sortBy, search } = req.query;

    // Mulai bangun query dinamis
    let query = 'SELECT * FROM movies WHERE 1=1';
    const params = [];

    // FILTER by type (film/series)
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    // SEARCH by title
    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    // SORT by field tertentu — whitelist dulu biar aman
    const allowedSort = ['title', 'year', 'rating_age'];
    if (sortBy && allowedSort.includes(sortBy)) {
      query += ` ORDER BY ${sortBy} ASC`;
    }

    const [rows] = await db.query(query, params);

    res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// ============================================================
// POST /api/movies — Tambah film baru (INSERT)
// ============================================================
router.post('/', async (req, res) => {
  const { title, img_url, year, duration, rating_age, description, director, type } = req.body;

  // Validasi field wajib
  if (!title) {
    return res.status(400).json({ success: false, message: 'Field title wajib diisi' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO movies (title, img_url, year, duration, rating_age, description, director, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, img_url, year, duration, rating_age, description, director, type || 'film']
    );

    res.status(201).json({
      success: true,
      message: 'Film berhasil ditambahkan',
      data: { id: result.insertId, title },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// PATCH /api/movies/:id — Update sebagian data film (UPDATE)
// ============================================================
router.patch('/:id', async (req, res) => {
  const { title, img_url, year, duration, rating_age, description, director, type } = req.body;

  // Cek apakah film ada
  const [existing] = await db.query('SELECT id FROM movies WHERE id = ?', [req.params.id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Film tidak ditemukan' });
  }

  // Bangun query dinamis — hanya update field yang dikirim
  const fields = [];
  const values = [];

  if (title)      { fields.push('title = ?');       values.push(title); }
  if (img_url)    { fields.push('img_url = ?');     values.push(img_url); }
  if (year)       { fields.push('year = ?');         values.push(year); }
  if (duration)   { fields.push('duration = ?');     values.push(duration); }
  if (rating_age) { fields.push('rating_age = ?');  values.push(rating_age); }
  if (description){ fields.push('description = ?'); values.push(description); }
  if (director)   { fields.push('director = ?');    values.push(director); }
  if (type)       { fields.push('type = ?');         values.push(type); }

  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada field yang diupdate' });
  }

  values.push(req.params.id);

  try {
    await db.query(
      `UPDATE movies SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true, message: 'Film berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// DELETE /api/movies/:id — Hapus film (DELETE)
// ============================================================
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM movies WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Film tidak ditemukan' });
    }

    res.json({ success: true, message: 'Film berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
