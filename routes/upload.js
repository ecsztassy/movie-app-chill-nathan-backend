const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Tidak ada file yang diupload'
    });
  }

  res.json({
    success: true,
    message: 'File berhasil diupload',
    data: {
      filename: req.file.filename,
      url: `http://localhost:3000/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

module.exports = router;