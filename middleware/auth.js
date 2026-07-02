const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak ditemukan'
    });
  }

  // Format header: "Bearer eyJ..."
  // Kita ambil bagian setelah "Bearer "
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Format token salah. Gunakan: Bearer <token>'
    });
  }

  try {
    // Verifikasi token dengan secret key yang sama saat login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user di request, bisa dipakai di route
    next(); // lanjut ke route handler
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah expired'
    });
  }
};

module.exports = { verifyToken };