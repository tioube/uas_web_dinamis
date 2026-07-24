# Sistem Pendaftaran Kegiatan Kampus

Aplikasi web dinamis untuk mengelola kegiatan kampus dan peserta, terdiri dari backend Express.js (TypeScript) dan frontend Next.js (TypeScript).

## Prasyarat
- Node.js (v18+)
- MySQL

## 1. Konfigurasi Database
1. Buat database baru di MySQL (misal: `uas_web_dinamis`).
2. Import file `database.sql` ke dalam database tersebut. File ini sudah berisi struktur tabel dan contoh data.

## 2. Menjalankan Backend (Port 3000)
1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Sesuaikan konfigurasi di file `.env` (berada di folder `backend/`):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=uas_web_dinamis
   JWT_SECRET=super_secret_jwt_key_123!
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=emailanda@gmail.com
   SMTP_PASS=app_password_google_anda
   ```
4. Jalankan backend dalam mode development:
   ```bash
   npm run dev
   ```

## 3. Menjalankan Frontend (Port 3001)
1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ubah port agar tidak bentrok dengan backend. Buka `package.json` di folder `frontend` dan ubah script `dev` menjadi:
   ```json
   "dev": "next dev -p 3001"
   ```
4. Jalankan frontend:
   ```bash
   npm run dev
   ```

## Akun Uji Coba
Password untuk semua akun di bawah ini adalah: **password123**

| Role | Email |
|------|-------|
| Admin | admin@dinamis.com |
| Operator | operator@dinamis.com |
| Viewer | viewer@dinamis.com |

## Daftar Endpoint Backend Minimal
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

- `GET /api/kegiatan?search=&filter=&page=&limit=`
- `GET /api/kegiatan/:id`
- `POST /api/kegiatan`
- `PUT /api/kegiatan/:id`
- `DELETE /api/kegiatan/:id`
- `POST /api/kegiatan/:id/upload`

- `GET /api/peserta?search=&kegiatan_id=&page=&limit=`
- `GET /api/peserta/:id`
- `POST /api/peserta`
- `PUT /api/peserta/:id`
- `DELETE /api/peserta/:id`

- `GET /api/users` (Admin only)
- `POST /api/users` (Admin only)
- `PUT /api/users/:id` (Admin only)
- `DELETE /api/users/:id` (Admin only)
- `POST /api/users/:id/reset-password` (Admin only) — Generate token & kirim ke email
- `POST /api/users/apply-reset-password` (Public) — Gunakan token untuk set password baru. Body: `{ token, new_password }`
