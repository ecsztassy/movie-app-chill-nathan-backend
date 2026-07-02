const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Routes
const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');  // ← tambah ini

app.use('/api/movies', moviesRouter);
app.use('/api', authRouter);
app.use('/api/upload', uploadRouter);              // ← tambah ini
app.use('/uploads', express.static('uploads'));    // ← tambah ini

app.get('/', (req, res) => {
  res.json({ message: '🎬 Movie App API berjalan!' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});