const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail } = require('../services/mailer');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// POST /api/register
router.post('/register', async (req, res) => {
  const { fullname, username, email, password } = req.body;

  // Validasi field wajib
  if (!fullname || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Semua field wajib diisi: fullname, username, email, password'
    });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email atau username sudah terdaftar'
      });
    }

    // Hash password sebelum disimpan — JANGAN simpan plain text
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // INSERT ke database
 // Generate token verifikasi unik
const verificationToken = uuidv4();

const [result] = await db.query(
  `INSERT INTO users (fullname, username, email, password, verification_token)
   VALUES (?, ?, ?, ?, ?)`,
  [fullname, username, email, hashedPassword, verificationToken]
);

// Kirim email verifikasi
await sendVerificationEmail(email, verificationToken);

res.status(201).json({
  success: true,
  message: 'Registrasi berhasil. Cek email kamu untuk verifikasi akun.',
  data: { id: result.insertId, fullname, username, email }
});

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
  
});
const jwt = require('jsonwebtoken');

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi'
    });
  }

  try {
    // Langkah 1: cari user by email
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    const user = rows[0];

    // Langkah 2: bandingkan password dengan hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Langkah 3: generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      token: token,
      data: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// GET /api/verify-email?token=xxx
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token tidak ditemukan' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE verification_token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Verification Token'
      });
    }

    await db.query(
      'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
      [rows[0].id]
    );

    res.json({ success: true, message: 'Email Verified Successfully' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;