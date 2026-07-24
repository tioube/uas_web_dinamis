CREATE DATABASE IF NOT EXISTS uas_web_dinamis;
USE uas_web_dinamis;

CREATE TABLE IF NOT EXISTS jenis_kegiatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jenis VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS kegiatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    jenis_kegiatan_id INT NOT NULL,
    tanggal DATE NOT NULL,
    lokasi VARCHAR(255) NOT NULL,
    status ENUM('aktif', 'selesai', 'batal') DEFAULT 'aktif',
    poster VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (jenis_kegiatan_id) REFERENCES jenis_kegiatan(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS peserta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan_id INT NOT NULL,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kegiatan_id) REFERENCES kegiatan(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator', 'viewer') NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expired_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert dummy users (password: 'password123' hashed with bcrypt, 10 rounds)
-- Hash for 'password123': $2b$10$P73SwUWg1URxCdEanK7OF.Lx02GiyvL1PaMGrMrmfGRmZYmizt8t6
INSERT INTO users (nama, email, password, role) VALUES
('Admin User', 'admin@dinamis.com', '$2b$10$P73SwUWg1URxCdEanK7OF.Lx02GiyvL1PaMGrMrmfGRmZYmizt8t6', 'admin'),
('Operator User', 'operator@dinamis.com', '$2b$10$P73SwUWg1URxCdEanK7OF.Lx02GiyvL1PaMGrMrmfGRmZYmizt8t6', 'operator'),
('Viewer User', 'viewer@dinamis.com', '$2b$10$P73SwUWg1URxCdEanK7OF.Lx02GiyvL1PaMGrMrmfGRmZYmizt8t6', 'viewer');

-- Insert dummy jenis kegiatan
INSERT INTO jenis_kegiatan (nama_jenis) VALUES
('Seminar'),
('Workshop'),
('Lomba'),
('Pelatihan'),
('Pengabdian Masyarakat');

-- Insert dummy kegiatan
INSERT INTO kegiatan (judul, jenis_kegiatan_id, tanggal, lokasi, status) VALUES
('Seminar Teknologi Masa Depan', 1, '2026-08-10', 'Auditorium Utama', 'aktif'),
('Workshop Web Development', 2, '2026-08-15', 'Lab Komputer 1', 'aktif');

-- Insert dummy peserta
INSERT INTO peserta (kegiatan_id, nama, email, no_hp) VALUES
(1, 'Budi Santoso', 'budi@example.com', '081234567890'),
(2, 'Andi Wijaya', 'andi@example.com', '081987654321');
