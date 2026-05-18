# IT Helpdesk Ticketing & Asset Inventory

## Overview
Aplikasi service desk perusahaan yang dibangun menggunakan TypeScript sebagai bahasa utama, dengan stack React + TypeScript untuk frontend, Node.js/Express untuk backend API, dan PostgreSQL + Drizzle ORM untuk database. Aplikasi ini mencatat, memprioritaskan, memantau, dan menyelesaikan tiket masalah IT karyawan secara profesional, serta mengelola inventaris aset perangkat perusahaan.

## Teknologi Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript (port 3001)
- **Database**: PostgreSQL + Drizzle ORM
- **Routing**: React Router v6
- **Icons**: Lucide React
- **i18n**: Custom multi-language context (6 bahasa)
- **PWA**: vite-plugin-pwa

## Fitur Utama
- **Dashboard**: Statistik tiket dan aset secara real-time dari database
- **Manajemen Tiket**: CRUD tiket dengan divisi, SLA, teknisi, catatan penyelesaian, kategori lengkap
- **Inventaris Aset**: CRUD aset dengan departemen, nomor seri, lisensi, garansi, lokasi
- **Laporan & Analitik**: Grafik bar per status/prioritas/kategori + performa teknisi + ekspor CSV
- **Multi-language**: Bahasa Indonesia, English, Deutsch, 中文, 日本語, Tiếng Việt
- **Language Switcher**: Dropdown di sidebar dan topbar

## Struktur Proyek
```
├── server/
│   ├── index.ts          # Express app + DB init + seed data
│   ├── db.ts             # Drizzle + PostgreSQL connection
│   ├── schema.ts         # Drizzle schema (tickets, assets)
│   └── routes/
│       ├── tickets.ts    # CRUD API /api/tickets
│       └── assets.ts     # CRUD API /api/assets
├── src/
│   ├── components/       # Layout, Toast
│   ├── contexts/         # LanguageContext
│   ├── i18n/             # translations.ts (6 bahasa)
│   ├── pages/            # Dashboard, Tickets, Assets, Reports
│   ├── types/            # TypeScript types
│   ├── hooks/            # useLocalStorage
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── drizzle.config.ts
├── vite.config.ts        # Proxy /api → localhost:3001
└── package.json
```

## Cara Menjalankan
```bash
npm install
npm run dev    # Starts backend (port 3001) + frontend (port 5000)
```

## API Endpoints
- `GET/POST /api/tickets` — list & create tickets
- `PUT/DELETE /api/tickets/:id` — update & delete ticket
- `GET/POST /api/assets` — list & create assets
- `PUT/DELETE /api/assets/:id` — update & delete asset
- `GET /api/health` — health check

## Model Data

### Tiket
- `ticketId`, `title`, `description`, `status`, `priority`, `category`, `division`
- `requesterName`, `requesterEmail`, `assignedTo`, `slaHours`, `resolutionNotes`

### Aset
- `assetId`, `name`, `category`, `status`, `serialNumber`, `purchaseDate`, `warrantyExpiry`
- `assignedTo`, `department`, `location`, `licenseKey`, `licenseExpiry`, `notes`

## Status & Prioritas
### Status Tiket: `open` | `in_progress` | `resolved` | `closed`
### Prioritas: `low` | `medium` | `high` | `critical`
### Status Aset: `active` | `maintenance` | `retired` | `disposed`
### SLA: 4h / 8h / 24h / 48h / 72h

## Bahasa yang Didukung
- 🇮🇩 Bahasa Indonesia
- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇨🇳 中文
- 🇯🇵 日本語
- 🇻🇳 Tiếng Việt

## Recent Changes
- 18 May 2026: Full migration — React+TS frontend, Node.js/Express backend, PostgreSQL+Drizzle ORM, multi-language support (6 bahasa), new fields (divisi, SLA, departemen, lisensi), Reports page with CSV export
