# 🎬 Movie App CHILL — Backend API

REST API untuk aplikasi streaming film **Movie App CHILL**, dibangun dengan Node.js, Express.js, dan MySQL.

---

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via XAMPP)
- **Authentication**: JSON Web Token (JWT)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer + Mailtrap (sandbox)
- **File Upload**: Multer

---

## 📁 Struktur Project

```
chill-app-backend/
├── config/
│   └── db.js              # Konfigurasi koneksi MySQL
├── middleware/
│   ├── auth.js            # Middleware verifikasi JWT token
│   └── upload.js          # Konfigurasi multer untuk upload file
├── routes/
│   ├── auth.js            # Endpoint register, login, verify-email
│   ├── movies.js          # Endpoint CRUD movies
│   └── upload.js          # Endpoint upload gambar
├── services/
│   └── mailer.js          # Fungsi kirim email via Nodemailer
├── uploads/               # Folder penyimpanan file upload (tidak di-push ke repo)
├── .env.example           # Template environment variables
├── .gitignore
├── index.js               # Entry point aplikasi
└── package.json
```

---

## ⚙️ Instalasi & Setup

### 1. Clone repo

```bash
git clone https://github.com/ecsztassy/movie-app-chill-nathan-backend.git
cd movie-app-chill-nathan-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

Copy dari template:

```bash
cp .env.example .env
```

Isi sesuai konfigurasi lokal kamu:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=movie_app
DB_PORT=3306
PORT=3000
JWT_SECRET=isi_dengan_secret_kamu
EMAIL_USER=isi_dengan_user_mailtrap
EMAIL_PASS=isi_dengan_pass_mailtrap
```

### 4. Buat database di MySQL

Jalankan XAMPP, aktifkan MySQL, lalu import skema database:

```sql
CREATE DATABASE IF NOT EXISTS movie_app;
USE movie_app;

CREATE TABLE users (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    fullname            VARCHAR(100) NOT NULL,
    username            VARCHAR(50) NOT NULL UNIQUE,
    email               VARCHAR(150) NOT NULL UNIQUE,
    password            VARCHAR(255) NOT NULL,
    verification_token  VARCHAR(255) NULL,
    is_verified         BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    img_url     VARCHAR(255),
    year        VARCHAR(10),
    duration    VARCHAR(20),
    rating_age  VARCHAR(20),
    description TEXT,
    director    VARCHAR(150),
    type        ENUM('film', 'series') DEFAULT 'film',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Buat folder uploads

```bash
mkdir uploads
```

### 6. Jalankan server

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`

---

## 📌 Endpoint API

### Auth

| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| POST | `/api/register` | Registrasi user baru | ❌ |
| POST | `/api/login` | Login dan dapat JWT token | ❌ |
| GET | `/api/verify-email?token=xxx` | Verifikasi email via token | ❌ |

**Payload Register:**
```json
{
  "fullname": "Budi Santoso",
  "username": "budisantoso",
  "email": "budi@gmail.com",
  "password": "password123"
}
```

**Payload Login:**
```json
{
  "email": "budi@gmail.com",
  "password": "password123"
}
```

---

### Movies

| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| GET | `/api/movies` | Ambil semua film | ✅ |
| GET | `/api/movies/:id` | Ambil film by ID | ✅ |
| POST | `/api/movies` | Tambah film baru | ✅ |
| PATCH | `/api/movies/:id` | Update film by ID | ✅ |
| DELETE | `/api/movies/:id` | Hapus film by ID | ✅ |

**Query Params (GET /api/movies):**

| Param | Contoh | Keterangan |
|---|---|---|
| `type` | `?type=film` | Filter by tipe (film/series) |
| `search` | `?search=warkop` | Cari by judul |
| `sortBy` | `?sortBy=title` | Urutkan by field (title/year/rating_age) |

Contoh kombinasi:
```
GET /api/movies?type=film&sortBy=title&search=a
```

**Payload POST/PATCH Movie:**
```json
{
  "title": "Warkop DKI Reborn",
  "year": "2016",
  "duration": "1j 38m",
  "rating_age": "13+",
  "description": "Dono, Kasino, dan Indro kembali beraksi",
  "director": "Anggy Umbara",
  "type": "film"
}
```

---

### Upload

| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| POST | `/api/upload` | Upload gambar (JPG/PNG/WEBP, maks 2MB) | ✅ |

**Form data:**
- Key: `file` (type: File)
- Value: pilih file gambar

---

## 🔐 Autentikasi

Semua endpoint bertanda ✅ membutuhkan JWT token di header:

```
Authorization: Bearer <token>
```

Token didapat dari response login.

---

## 📧 Email Verifikasi

Menggunakan **Mailtrap** untuk sandbox testing. Setelah register, cek inbox Mailtrap dan klik link verifikasi yang dikirim.

---

## 👤 Author

**Nathan Ahnaf** — Bootcamp Full Stack Developer 2026
