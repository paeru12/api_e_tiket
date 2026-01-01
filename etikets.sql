-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Jan 2026 pada 13.28
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `etikets`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin_audit_logs`
--

CREATE TABLE `admin_audit_logs` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin_audit_logs`
--

INSERT INTO `admin_audit_logs` (`id`, `user_id`, `action`, `ip_address`, `user_agent`, `created_at`) VALUES
('02a76d5e-8354-4ec7-8515-c581ed90fbcb', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-22 07:56:21'),
('2f20ab06-bb09-45ac-bf12-60ab1af817d9', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-17 16:18:48'),
('38e302bd-cb22-4a18-862c-2c93cc2a225f', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-17 16:11:32'),
('3a6e9497-ae8c-477c-a6ed-9aa9bcd0acca', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-18 09:49:36'),
('3bf2f6bf-5de7-4d16-9794-757f4ba4905a', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-22 08:16:12'),
('3fa8eced-33f6-494b-a24d-002cf86938d8', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-17 15:56:12'),
('4cd4d03d-4d47-495d-91c5-e08e35b4bd7d', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-18 08:50:51'),
('51e25996-58c2-4cde-b584-7aad8a8a33bc', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-18 10:08:59'),
('53a7f810-3f5f-4c9f-82ee-75b4b386773e', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-22 17:57:30'),
('5f062aa4-20b6-46c2-8ade-b2f692614e1a', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-23 15:51:00'),
('670725ba-be9b-4d62-b995-f6efdc24e066', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-16 10:48:29'),
('6f3a4561-8c79-407d-8748-00e4c8bc0822', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-16 10:13:22'),
('750273f2-5857-4327-a366-44e781d4241b', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-18 10:07:08'),
('7be2cfb3-1694-43f4-bfb1-7c1ce4501c7b', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-16 10:13:50'),
('8b76b869-00aa-4d36-8630-6d7a7932b245', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-16 10:42:51'),
('b8d042d6-490a-4f30-9f77-30b09071196a', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-18 11:14:10'),
('b906e8c8-aff6-4212-815f-f15c37d77ac5', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-22 06:30:05'),
('c5f7a3e4-818a-4fff-b759-e77c7daf66b0', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-17 15:36:49'),
('cdefdf86-ce99-4f5f-8ff3-2818202029f7', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-16 10:12:08'),
('ded70955-2887-43a4-996c-2206bc1ad2f1', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'LOGIN_SUCCESS', '::ffff:127.0.0.1', 'PostmanRuntime/7.51.0', '2025-12-16 10:14:20');

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin_refresh_tokens`
--

CREATE TABLE `admin_refresh_tokens` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `token` text DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin_refresh_tokens`
--

INSERT INTO `admin_refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
('e0e7bbe3-d4a6-4f27-b887-357819728e45', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5OWNmNzZiLTAxZjktNDdmYy1iNmFhLTgxZjc4ZDUzM2JlMiIsInJvbGVzIjpbIlNVUEVSQURNSU4iXSwiaWF0IjoxNzY1ODgyMTA5LCJleHAiOjE3NjY0ODY5MDl9.5ehXpVmi-w7H14lMODVl5MISCV0xxpMAUWkrQBPFTmw', '2025-12-23 10:48:29', '2025-12-16 10:48:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `creators`
--

CREATE TABLE `creators` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` text NOT NULL,
  `image` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `creators`
--

INSERT INTO `creators` (`id`, `user_id`, `name`, `slug`, `image`, `created_at`, `updated_at`, `deleted_at`) VALUES
('57e0fe5d-78e2-42ca-a6c1-f934e7416910', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'pt. dirgantara indonesia update', 'pt-dirgantara-indonesia-update', '/uploads/creators/1766480684578-950643659.webp', '2025-12-23 15:58:35', '2025-12-23 16:09:49', '2025-12-23 16:09:49'),
('5d632395-87f2-4c9d-bb55-575f6ac60f46', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'synchronize fest', 'synchronize-fest', '/uploads/creators/1766480736007-676559765.webp', '2025-12-23 16:05:36', '2025-12-23 16:05:36', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `customer_users`
--

CREATE TABLE `customer_users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `customer_users`
--

INSERT INTO `customer_users` (`id`, `full_name`, `email`, `phone`, `photo_url`, `created_at`, `updated_at`, `deleted_at`) VALUES
('8b40176f-6d3a-46ba-880e-7070664453a2', NULL, 'ghb82816@gmail.com', NULL, NULL, '2025-12-12 10:55:38', '2025-12-12 10:55:38', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `events`
--

CREATE TABLE `events` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `creator_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `region_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `kategori_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` text NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `sk` text DEFAULT NULL,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `time_start` time DEFAULT NULL,
  `time_end` time DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `status` enum('draft','published','ended') NOT NULL DEFAULT 'draft',
  `image` text DEFAULT NULL,
  `layout_venue` text DEFAULT NULL,
  `map` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `lowest_price` decimal(15,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `events`
--

INSERT INTO `events` (`id`, `creator_id`, `region_id`, `kategori_id`, `user_id`, `name`, `slug`, `deskripsi`, `sk`, `date_start`, `date_end`, `time_start`, `time_end`, `is_active`, `status`, `image`, `layout_venue`, `map`, `location`, `keywords`, `lowest_price`, `created_at`, `updated_at`, `deleted_at`) VALUES
('3b437e79-4018-4810-a66c-5d139a128dca', '5d632395-87f2-4c9d-bb55-575f6ac60f46', '9b628a16-1b30-445e-bbfd-9f1e5df8bd9a', 'd7765f78-9d7f-4bd1-ae5b-61f5f85309a4', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'synchronize fest', 'synchronize-fest', 'deskripsi synchronize fest', 's&k synchronize fest', '2025-12-25', '2025-12-25', '09:00:00', '23:00:00', 1, 'draft', '/uploads/events/1766550943659-10275877.webp', '/uploads/events/1766550944837-785164356.webp', 'https://maps.com', 'Stadion Kanjuruhan malang', 'sync, kanjuruhan, malang, event', 250000.00, '2025-12-24 11:35:45', '2025-12-24 11:51:55', NULL),
('a01a5a23-908d-4d1d-b9f6-63bab741a004', '5d632395-87f2-4c9d-bb55-575f6ac60f46', '9b628a16-1b30-445e-bbfd-9f1e5df8bd9a', 'd7765f78-9d7f-4bd1-ae5b-61f5f85309a4', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'synchronize fest 4', 'synchronize-fest-4', 'deskripsi synchronize fest 3', 's&k synchronize fest 3', '2025-12-30', '2026-01-01', '09:00:00', '23:59:00', 1, 'published', NULL, NULL, 'https://maps.com', 'Lapangna Rampal kota malang', 'sync, lapangan rampal, malang, event', 25000.00, '2025-12-30 13:01:21', '2025-12-30 13:01:21', NULL),
('bee3075f-a4ab-432c-a0d9-b0e33696d151', '5d632395-87f2-4c9d-bb55-575f6ac60f46', '9b628a16-1b30-445e-bbfd-9f1e5df8bd9a', 'd7765f78-9d7f-4bd1-ae5b-61f5f85309a4', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'synchronize fest 5', 'synchronize-fest-5', 'deskripsi synchronize fest 3', 's&k synchronize fest 3', '2025-12-30', '2026-01-01', '09:00:00', '23:59:00', 1, 'ended', '/uploads/events/1767075568935-215567835.webp', '/uploads/events/1767075569281-126557419.webp', 'https://maps.com', 'Lapangna Rampal kota malang', 'sync, lapangan rampal, malang, event', 25000.00, '2025-12-30 13:19:29', '2025-12-30 13:19:29', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategoris`
--

CREATE TABLE `kategoris` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` text NOT NULL,
  `description` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategoris`
--

INSERT INTO `kategoris` (`id`, `user_id`, `name`, `slug`, `description`, `keywords`, `image`, `created_at`, `updated_at`) VALUES
('2eb5abb5-3520-4e2e-aa42-f11892d69414', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'theaterfsdf dsad', 'theaterfsdf-dsad', 'theater di ruang tertutup', 'theather, musik, kategori musik, tiket konser, tiket online', '/uploads/kategoris/1766390589362-982311618.webp', '2025-12-22 08:03:09', '2025-12-22 08:03:09'),
('58c01aeb-0dd5-4b76-b311-4d3674014907', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'musik 4', 'musik-4', 'musik test api postman', 'musik, kategori musik, tiket konser, tiket online', '/uploads/kategoris/1766385401125-895609178.webp', '2025-12-22 06:36:41', '2025-12-22 06:36:41'),
('6152539f-ec79-4c82-9f51-6702a5ecb773', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'theater', 'theater', 'theater di ruang tertutup', 'theather, musik, kategori musik, tiket konser, tiket online', '/uploads/kategoris/1766390551931-945958872.webp', '2025-12-22 08:02:32', '2025-12-22 08:02:32'),
('d7765f78-9d7f-4bd1-ae5b-61f5f85309a4', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'theaterfsdf dsad fsdf', 'theaterfsdf-dsad-fsdf', 'theater di ruang tertutup', 'theather, musik, kategori musik, tiket konser, tiket online', '/uploads/kategoris/1766401552498-92601011.webp', '2025-12-22 18:05:52', '2025-12-22 18:05:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `code_order` varchar(50) NOT NULL,
  `customer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `type_identity` varchar(255) DEFAULT NULL,
  `no_identity` varchar(255) DEFAULT NULL,
  `total_amount` decimal(15,2) DEFAULT 0.00,
  `status` enum('pending','waiting_payment','paid','expired','canceled') DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `expired_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `code_order`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `type_identity`, `no_identity`, `total_amount`, `status`, `payment_method`, `expired_at`, `created_at`, `updated_at`) VALUES
('67b87c0a-2a7f-403d-902d-68552996f4dd', 'INV-1767263582795', '8b40176f-6d3a-46ba-880e-7070664453a2', 'Andi Pratama', 'ghb82816@gmail.com', '081234567890', 'KTP', '3579010101010001', 175000.00, 'waiting_payment', NULL, '2026-01-01 17:48:02', '2026-01-01 17:33:02', '2026-01-01 17:33:02'),
('d8d68c46-65fd-412b-a778-0ab772ea71dd', 'INV-1767267793461', '8b40176f-6d3a-46ba-880e-7070664453a2', 'Andi Pratama 2', 'ghb82816@gmail.com', '081234567890', 'KTP', '3579010101010001', 25000.00, 'waiting_payment', NULL, '2026-01-01 18:58:13', '2026-01-01 18:43:13', '2026-01-01 18:43:13'),
('f8cdb356-7dba-4ca3-b450-ad32d451e0f1', 'INV-1767268531791', '8b40176f-6d3a-46ba-880e-7070664453a2', 'Andi Pratama 2', 'ghb82816@gmail.com', '081234567890', 'KTP', '3579010101010001', 25000.00, 'waiting_payment', NULL, '2026-01-01 19:10:31', '2026-01-01 18:55:31', '2026-01-01 18:55:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `order_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticket_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  `unit_price` decimal(15,2) DEFAULT NULL,
  `total_price` decimal(15,2) DEFAULT NULL,
  `attendees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`attendees`)),
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `ticket_type_id`, `quantity`, `unit_price`, `total_price`, `attendees`, `created_at`, `updated_at`) VALUES
('25a064ca-bed6-409e-a8e8-04d34e7532d3', 'd8d68c46-65fd-412b-a778-0ab772ea71dd', 'ad187018-1dc2-404d-86bb-e586ba384f4b', 1, 25000.00, 25000.00, '\"[{\\\"name\\\":\\\"Siti Aminah 2\\\",\\\"email\\\":\\\"ghb82816@gmail.com\\\",\\\"phone\\\":\\\"081377788899\\\",\\\"type_identity\\\":\\\"KTP\\\",\\\"no_identity\\\":\\\"3579030303030003\\\"}]\"', '2026-01-01 18:43:13', '2026-01-01 18:43:13'),
('338ab480-6c4b-4278-9b21-3fec72f3fe27', '67b87c0a-2a7f-403d-902d-68552996f4dd', 'ad187018-1dc2-404d-86bb-e586ba384f4b', 3, 25000.00, 75000.00, '\"[{\\\"name\\\":\\\"Siti Aminah\\\",\\\"email\\\":\\\"ghb82816@gmail.com\\\",\\\"phone\\\":\\\"081377788899\\\",\\\"type_identity\\\":\\\"KTP\\\",\\\"no_identity\\\":\\\"3579030303030003\\\"},{\\\"name\\\":\\\"Rina Wulandari\\\",\\\"email\\\":\\\"ghb82816@gmail.com\\\",\\\"phone\\\":\\\"081399988877\\\",\\\"type_identity\\\":\\\"SIM\\\",\\\"no_identity\\\":\\\"SIM12345678\\\"},{\\\"name\\\":\\\"Dewi Lestari\\\",\\\"email\\\":\\\"ghb82816@gmail.com\\\",\\\"phone\\\":\\\"081355566677\\\",\\\"type_identity\\\":\\\"KTP\\\",\\\"no_identity\\\":\\\"3579040404040004\\\"}]\"', '2026-01-01 17:33:03', '2026-01-01 17:33:03'),
('9e460bed-73c8-41d3-840f-5fb15a38caec', '67b87c0a-2a7f-403d-902d-68552996f4dd', '88361b7e-beb0-46f5-8973-e3d531a0d424', 2, 50000.00, 100000.00, '\"[{\\\"name\\\":\\\"Andi Pratama\\\",\\\"email\\\":\\\"ghb82816@gmail.com\\\",\\\"phone\\\":\\\"081234567890\\\",\\\"type_identity\\\":\\\"KTP\\\",\\\"no_identity\\\":\\\"3579010101010001\\\"},{\\\"name\\\":\\\"Budi Santoso\\\",\\\"email\\\":\\\"ghb82816@gmail.com\\\",\\\"phone\\\":\\\"081298765432\\\",\\\"type_identity\\\":\\\"KTP\\\",\\\"no_identity\\\":\\\"3579020202020002\\\"}]\"', '2026-01-01 17:33:02', '2026-01-01 17:33:02'),
('bcf230fe-38c0-44ba-a040-eb6f226fd88e', 'f8cdb356-7dba-4ca3-b450-ad32d451e0f1', 'ad187018-1dc2-404d-86bb-e586ba384f4b', 1, 25000.00, 25000.00, '\"[{\\\"name\\\":\\\"Siti Aminah 2\\\",\\\"email\\\":\\\"ghb82816@gmail.com\\\",\\\"phone\\\":\\\"081377788899\\\",\\\"type_identity\\\":\\\"KTP\\\",\\\"no_identity\\\":\\\"3579030303030003\\\"}]\"', '2026-01-01 18:55:31', '2026-01-01 18:55:31');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `order_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `provider_transactions` varchar(255) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `status` enum('pending','paid','failed') DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `qris_payload` text DEFAULT NULL,
  `qris_image_url` text DEFAULT NULL,
  `qris_expired_at` datetime DEFAULT NULL,
  `raw_callback_log` text DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `provider`, `provider_transactions`, `amount`, `status`, `payment_method`, `qris_payload`, `qris_image_url`, `qris_expired_at`, `raw_callback_log`, `paid_at`, `created_at`, `updated_at`) VALUES
('2267013d-556f-4338-949e-3c3b9dc4086e', 'f8cdb356-7dba-4ca3-b450-ad32d451e0f1', 'xendit', '695660f2f71f8b0973be138e', 25000.00, 'pending', 'INVOICE', NULL, NULL, NULL, '{\"id\":\"695660f2f71f8b0973be138e\",\"externalId\":\"INV-1767268531791\",\"userId\":\"656171bdcd69bc90d85a97ff\",\"description\":\"Pembayaran INV-1767268531791\",\"status\":\"PENDING\",\"merchantName\":\"Test Marketplace\",\"merchantProfilePictureUrl\":\"https://du8nwjtfkinx.cloudfront.net/xendit.png\",\"amount\":25000,\"expiryDate\":\"2026-01-01T12:06:34.454Z\",\"invoiceUrl\":\"https://checkout-staging.xendit.co/web/695660f2f71f8b0973be138e\",\"availableBanks\":[],\"availableRetailOutlets\":[],\"availableEwallets\":[{\"ewalletType\":\"SHOPEEPAY\"},{\"ewalletType\":\"JENIUSPAY\"},{\"ewalletType\":\"DANA\"},{\"ewalletType\":\"LINKAJA\"},{\"ewalletType\":\"OVO\"},{\"ewalletType\":\"GOPAY\"}],\"availableQrCodes\":[{\"qrCodeType\":\"QRIS\"}],\"availableDirectDebits\":[],\"availablePaylaters\":[],\"shouldExcludeCreditCard\":true,\"shouldSendEmail\":false,\"created\":\"2026-01-01T11:56:34.775Z\",\"updated\":\"2026-01-01T11:56:34.775Z\",\"successRedirectUrl\":\"http://localhost:5173/payment/success\",\"failureRedirectUrl\":\"http://localhost:5173/payment/failed\",\"currency\":\"IDR\",\"customer\":{\"givenNames\":\"Andi Pratama 2\",\"email\":\"ghb82816@gmail.com\",\"mobileNumber\":\"+6281234567890\"},\"customerNotificationPreference\":{\"invoiceCreated\":[\"email\"],\"invoiceReminder\":[\"email\"],\"invoicePaid\":[\"email\"]}}', NULL, '2026-01-01 18:56:43', '2026-01-01 18:56:43'),
('4973981b-0d53-4c53-94d7-482f1092493d', '67b87c0a-2a7f-403d-902d-68552996f4dd', 'xendit', '69565abe1425815536be3df3', 175000.00, 'pending', 'INVOICE', NULL, NULL, NULL, '{\"id\":\"69565abe1425815536be3df3\",\"externalId\":\"INV-1767263582795\",\"userId\":\"656171bdcd69bc90d85a97ff\",\"description\":\"Pembayaran INV-1767263582795\",\"status\":\"PENDING\",\"merchantName\":\"Test Marketplace\",\"merchantProfilePictureUrl\":\"https://du8nwjtfkinx.cloudfront.net/xendit.png\",\"amount\":175000,\"expiryDate\":\"2026-01-01T11:40:07.097Z\",\"invoiceUrl\":\"https://checkout-staging.xendit.co/web/69565abe1425815536be3df3\",\"availableBanks\":[],\"availableRetailOutlets\":[],\"availableEwallets\":[{\"ewalletType\":\"SHOPEEPAY\"},{\"ewalletType\":\"JENIUSPAY\"},{\"ewalletType\":\"DANA\"},{\"ewalletType\":\"LINKAJA\"},{\"ewalletType\":\"OVO\"},{\"ewalletType\":\"GOPAY\"}],\"availableQrCodes\":[{\"qrCodeType\":\"QRIS\"}],\"availableDirectDebits\":[],\"availablePaylaters\":[],\"shouldExcludeCreditCard\":true,\"shouldSendEmail\":false,\"created\":\"2026-01-01T11:30:07.520Z\",\"updated\":\"2026-01-01T11:30:07.520Z\",\"successRedirectUrl\":\"http://localhost:5173/payment/success\",\"failureRedirectUrl\":\"http://localhost:5173/payment/failed\",\"currency\":\"IDR\",\"customer\":{\"givenNames\":\"Andi Pratama\",\"email\":\"ghb82816@gmail.com\",\"mobileNumber\":\"+6281234567890\"},\"customerNotificationPreference\":{\"invoiceCreated\":[\"email\"],\"invoiceReminder\":[\"email\"],\"invoicePaid\":[\"email\"]}}', NULL, '2026-01-01 18:30:14', '2026-01-01 18:30:14'),
('5ceb2a1b-21a5-49b6-a0f4-0e739676f51d', 'd8d68c46-65fd-412b-a778-0ab772ea71dd', 'xendit', '69565de1f71f8b0973be1121', 25000.00, 'pending', 'INVOICE', NULL, NULL, NULL, '{\"id\":\"69565de1f71f8b0973be1121\",\"externalId\":\"INV-1767267793461\",\"userId\":\"656171bdcd69bc90d85a97ff\",\"description\":\"Pembayaran INV-1767267793461\",\"status\":\"PENDING\",\"merchantName\":\"Test Marketplace\",\"merchantProfilePictureUrl\":\"https://du8nwjtfkinx.cloudfront.net/xendit.png\",\"amount\":25000,\"expiryDate\":\"2026-01-01T11:53:29.179Z\",\"invoiceUrl\":\"https://checkout-staging.xendit.co/web/69565de1f71f8b0973be1121\",\"availableBanks\":[],\"availableRetailOutlets\":[],\"availableEwallets\":[{\"ewalletType\":\"SHOPEEPAY\"},{\"ewalletType\":\"JENIUSPAY\"},{\"ewalletType\":\"DANA\"},{\"ewalletType\":\"LINKAJA\"},{\"ewalletType\":\"OVO\"},{\"ewalletType\":\"GOPAY\"}],\"availableQrCodes\":[{\"qrCodeType\":\"QRIS\"}],\"availableDirectDebits\":[],\"availablePaylaters\":[],\"shouldExcludeCreditCard\":true,\"shouldSendEmail\":false,\"created\":\"2026-01-01T11:43:29.484Z\",\"updated\":\"2026-01-01T11:43:29.484Z\",\"successRedirectUrl\":\"http://localhost:5173/payment/success\",\"failureRedirectUrl\":\"http://localhost:5173/payment/failed\",\"currency\":\"IDR\",\"customer\":{\"givenNames\":\"Andi Pratama 2\",\"email\":\"ghb82816@gmail.com\",\"mobileNumber\":\"+6281234567890\"},\"customerNotificationPreference\":{\"invoiceCreated\":[\"email\"],\"invoiceReminder\":[\"email\"],\"invoicePaid\":[\"email\"]}}', NULL, '2026-01-01 18:43:36', '2026-01-01 18:43:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `regions`
--

CREATE TABLE `regions` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `regions`
--

INSERT INTO `regions` (`id`, `user_id`, `name`, `slug`, `description`, `keywords`, `image`, `created_at`, `updated_at`) VALUES
('030bad5b-3ed2-4124-9f1e-d66b946a60cb', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'malang fsg hgjjhg hk hj', 'malang-fsg-hgjjhg-hk-hj', 'kota malang', 'kota malang, malang, jawa timur, surabaya', '/uploads/regions/1766401141600-668499989.webp', '2025-12-22 17:59:01', '2025-12-22 17:59:01'),
('2acdff35-5152-43ea-a987-d193b37af152', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'malang fsg hgjjhg hk hj hukhu', 'malang-fsg-hgjjhg-hk-hj-hukhu', 'kota malang', 'kota malang, malang, jawa timur, surabaya', '/uploads/regions/1766401414802-719465663.webp', '2025-12-22 18:03:35', '2025-12-22 18:03:35'),
('9b628a16-1b30-445e-bbfd-9f1e5df8bd9a', '999cf76b-01f9-47fc-b6aa-81f78d533be2', 'malang update', 'malang-update', 'malang update theather musik test api postman upd', 'malang update, theather update, musik, kategori musik, tiket konser, tiket online', '/uploads/regions/1766391387990-849282375.webp', '2025-12-22 08:06:41', '2025-12-22 08:16:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('6b9e8940-d37b-11f0-9521-1cb72c0737b7', 'SUPERADMIN', 'Full system access', '2025-12-07 14:45:48', '2025-12-07 14:45:48'),
('6b9ea51c-d37b-11f0-9521-1cb72c0737b7', 'EVENT_ADMIN', 'Manage events & tickets', '2025-12-07 14:45:48', '2025-12-07 14:45:48'),
('6b9ea609-d37b-11f0-9521-1cb72c0737b7', 'SCAN_STAFF', 'Ticket scanner staff', '2025-12-07 14:45:48', '2025-12-07 14:45:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data untuk tabel `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20251207142739-create-User.js'),
('20251207142808-create-roles.js'),
('20251207142815-create-user-roles.js'),
('20251209073145-create-customer-user.js'),
('20251216100538-create-admin-audit-logs.js'),
('20251216103536-create-admin-refresh-token.js'),
('20251217150426-create-kategoris.js'),
('20251222072618-create-regions.js'),
('20251223083247-create-creator.js'),
('20251223093703-create-events.js'),
('20251224065413-create-ticket-types.js'),
('20251224094734-create-orders.js'),
('20251224094809-create-order-items.js'),
('20251224094839-create-tickets.js'),
('20251224094911-create-payments.js');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tickets`
--

CREATE TABLE `tickets` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `ticket_code` varchar(255) NOT NULL,
  `order_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ticket_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `owner_phone` varchar(255) NOT NULL,
  `type_identity` varchar(100) NOT NULL,
  `no_identity` varchar(100) NOT NULL,
  `qr_payload` text NOT NULL,
  `status` enum('pending','issued','sent','used','expired','revoked') NOT NULL DEFAULT 'pending',
  `issued_at` datetime DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `used_at` datetime DEFAULT NULL,
  `used_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ticket_types`
--

CREATE TABLE `ticket_types` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `event_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(150) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `total_stock` bigint(20) NOT NULL,
  `ticket_sold` bigint(20) DEFAULT 0,
  `max_per_order` bigint(20) NOT NULL,
  `reserved_stock` bigint(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `status` enum('draft','available','closed') DEFAULT 'draft',
  `deliver_ticket` datetime DEFAULT NULL,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `time_start` time DEFAULT NULL,
  `time_end` time DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `ticket_types`
--

INSERT INTO `ticket_types` (`id`, `event_id`, `name`, `deskripsi`, `price`, `total_stock`, `ticket_sold`, `max_per_order`, `reserved_stock`, `is_active`, `status`, `deliver_ticket`, `date_start`, `date_end`, `time_start`, `time_end`, `created_at`, `updated_at`, `deleted_at`) VALUES
('31d4d9fe-400e-4322-8d27-ce348d411c67', '3b437e79-4018-4810-a66c-5d139a128dca', 'VIP', 'Tempat terbaik', 750000.00, 300, 0, 4, 0, 1, 'draft', '2025-12-01 00:00:00', '2025-12-01', '2025-12-10', '10:00:00', '21:00:00', '2025-12-24 14:13:23', '2025-12-24 14:13:23', NULL),
('3726b3de-c146-4f19-9027-5fd37ea7bbed', 'a01a5a23-908d-4d1d-b9f6-63bab741a004', 'Festival', 'Tempat terbaik', 25000.00, 300, 0, 4, 0, 1, 'draft', '2025-12-01 07:00:00', '2025-12-01', '2025-12-10', '10:00:00', '21:00:00', '2025-12-30 13:01:21', '2025-12-30 13:01:21', NULL),
('88361b7e-beb0-46f5-8973-e3d531a0d424', 'bee3075f-a4ab-432c-a0d9-b0e33696d151', 'VIP', 'Area biasa', 50000.00, 1000, 0, 6, 2, 1, 'available', '2025-12-01 07:00:00', '2025-12-01', '2025-12-10', '10:00:00', '21:00:00', '2025-12-30 13:19:29', '2026-01-01 17:33:02', NULL),
('9c05e855-2918-4a23-9860-99b13d541182', '3b437e79-4018-4810-a66c-5d139a128dca', 'Regular', 'Area biasa', 250000.00, 1000, 0, 6, 0, 1, 'draft', '2025-12-01 00:00:00', '2025-12-01', '2025-12-10', '10:00:00', '21:00:00', '2025-12-24 14:13:23', '2025-12-24 14:13:23', NULL),
('ad187018-1dc2-404d-86bb-e586ba384f4b', 'bee3075f-a4ab-432c-a0d9-b0e33696d151', 'Festival', 'Tempat terbaik', 25000.00, 300, 0, 4, 5, 1, 'available', '2025-12-01 07:00:00', '2025-12-01', '2025-12-10', '10:00:00', '21:00:00', '2025-12-30 13:19:29', '2026-01-01 18:55:31', NULL),
('c6b5037c-d4e2-4d9e-870f-363c79d10a2d', 'a01a5a23-908d-4d1d-b9f6-63bab741a004', 'VIP', 'Area biasa', 50000.00, 1000, 0, 6, 0, 1, 'draft', '2025-12-01 07:00:00', '2025-12-01', '2025-12-10', '10:00:00', '21:00:00', '2025-12-30 13:01:21', '2025-12-30 13:01:21', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT uuid(),
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_email_verified` tinyint(1) DEFAULT 0,
  `failed_login_attempts` int(1) NOT NULL,
  `is_locked` tinyint(1) NOT NULL,
  `image` text DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `is_active`, `is_email_verified`, `failed_login_attempts`, `is_locked`, `image`, `locked_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
('9530f55f-8402-4403-9ec9-27fcf5d5a7f7', 'sadmin@gmail.com', '$2b$12$ZvnlU.BNz9SfstDTfIzCSuM7OUuXkTQs3RCEImYy2VREx7EmDyMha', 'super admin 2', '08123243433', 1, 0, 0, 0, '/uploads/users/1766052609413-504321615.webp', NULL, '2025-12-18 10:07:31', '2025-12-18 10:12:16', '2025-12-18 10:12:16'),
('999cf76b-01f9-47fc-b6aa-81f78d533be2', 'superadmin@gmail.com', '$2b$12$XmiljkxYlVMb.aG0eozKzuSdSNTAUSGUNMOJUEFRKUG0Z10B7DC5C', 'super admin', '08123243433', 1, 0, 0, 0, '/uploads/users/1766052117841-293612635.webp', NULL, '2025-12-07 15:57:01', '2025-12-18 10:01:58', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `created_at`, `updated_at`) VALUES
('9530f55f-8402-4403-9ec9-27fcf5d5a7f7', '6b9e8940-d37b-11f0-9521-1cb72c0737b7', '2025-12-18 10:07:31', NULL),
('999cf76b-01f9-47fc-b6aa-81f78d533be2', '6b9e8940-d37b-11f0-9521-1cb72c0737b7', '2025-12-07 15:57:01', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin_audit_logs`
--
ALTER TABLE `admin_audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `admin_refresh_tokens`
--
ALTER TABLE `admin_refresh_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `creators`
--
ALTER TABLE `creators`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `customer_users`
--
ALTER TABLE `customer_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kategoris`
--
ALTER TABLE `kategoris`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_order` (`code_order`);

--
-- Indeks untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_code` (`ticket_code`),
  ADD KEY `tickets_ticket_code` (`ticket_code`),
  ADD KEY `tickets_order_id` (`order_id`),
  ADD KEY `tickets_event_id` (`event_id`),
  ADD KEY `tickets_status` (`status`);

--
-- Indeks untuk tabel `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
