const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

// Test koneksi saat pertama kali dijalankan
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
    return;
  }
  console.log('✅ Berhasil koneksi ke MySQL database!');
  connection.release();
});

// Gunakan promise agar bisa pakai async/await di routes
module.exports = pool.promise();
