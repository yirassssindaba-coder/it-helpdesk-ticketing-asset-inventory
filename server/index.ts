import express from 'express';
import cors from 'cors';
import { db, pool } from './db';
import { tickets as ticketsTable, assets as assetsTable } from './schema';
import ticketRoutes from './routes/tickets';
import assetRoutes from './routes/assets';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketRoutes);
app.use('/api/assets', assetRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(20) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        priority VARCHAR(20) NOT NULL DEFAULT 'medium',
        category VARCHAR(50) NOT NULL DEFAULT 'Hardware',
        division VARCHAR(100) NOT NULL DEFAULT '',
        requester_name VARCHAR(100) NOT NULL,
        requester_email VARCHAR(150) NOT NULL DEFAULT '',
        assigned_to VARCHAR(100) NOT NULL DEFAULT '',
        sla_hours INTEGER NOT NULL DEFAULT 24,
        resolution_notes TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        asset_id VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'laptop',
        status VARCHAR(30) NOT NULL DEFAULT 'active',
        serial_number VARCHAR(100) NOT NULL DEFAULT '',
        purchase_date VARCHAR(20) NOT NULL DEFAULT '',
        warranty_expiry VARCHAR(20) NOT NULL DEFAULT '',
        assigned_to VARCHAR(100) NOT NULL DEFAULT '',
        department VARCHAR(100) NOT NULL DEFAULT '',
        location VARCHAR(150) NOT NULL DEFAULT '',
        license_key VARCHAR(255) NOT NULL DEFAULT '',
        license_expiry VARCHAR(20) NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    const existingTickets = await db.select().from(ticketsTable).limit(1);
    if (existingTickets.length === 0) {
      await db.insert(ticketsTable).values([
        { ticketId: 'TKT-001', title: 'Laptop tidak bisa menyala', description: 'Laptop Dell Latitude tidak merespon saat ditekan tombol power. Sudah dicoba charge semalaman.', status: 'open', priority: 'high', category: 'Hardware', division: 'Finance', requesterName: 'Ahmad Fauzi', requesterEmail: 'ahmad.fauzi@company.com', assignedTo: 'Budi Santoso', slaHours: 8, resolutionNotes: '', createdAt: new Date('2026-01-14T08:00:00Z'), updatedAt: new Date('2026-01-14T08:00:00Z') },
        { ticketId: 'TKT-002', title: 'Install Microsoft Office', description: 'Mohon bantuan untuk install Microsoft Office 365 di laptop baru.', status: 'in_progress', priority: 'medium', category: 'Software', division: 'Marketing', requesterName: 'Siti Rahayu', requesterEmail: 'siti.rahayu@company.com', assignedTo: 'Dewi Ayu', slaHours: 24, resolutionNotes: '', createdAt: new Date('2026-01-13T14:30:00Z'), updatedAt: new Date('2026-01-14T09:15:00Z') },
        { ticketId: 'TKT-003', title: 'Akses VPN bermasalah', description: 'Tidak bisa connect ke VPN kantor dari rumah. Error message: Connection timeout.', status: 'resolved', priority: 'high', category: 'Network', division: 'Engineering', requesterName: 'Dedi Kurniawan', requesterEmail: 'dedi.k@company.com', assignedTo: 'Rizal Hakim', slaHours: 8, resolutionNotes: 'Reset konfigurasi VPN client dan update sertifikat.', createdAt: new Date('2026-01-12T10:00:00Z'), updatedAt: new Date('2026-01-13T16:45:00Z') },
        { ticketId: 'TKT-004', title: 'Printer tidak terdeteksi', description: 'Printer HP LaserJet tidak muncul di daftar printer. Sudah coba restart komputer.', status: 'open', priority: 'low', category: 'Printer', division: 'HR', requesterName: 'Rina Wati', requesterEmail: 'rina.wati@company.com', assignedTo: 'Budi Santoso', slaHours: 48, resolutionNotes: '', createdAt: new Date('2026-01-14T11:20:00Z'), updatedAt: new Date('2026-01-14T11:20:00Z') },
        { ticketId: 'TKT-005', title: 'Reset password email', description: 'Lupa password email kantor, mohon bantuan reset.', status: 'closed', priority: 'medium', category: 'Account', division: 'Operations', requesterName: 'Joko Widodo', requesterEmail: 'joko.w@company.com', assignedTo: 'Dewi Ayu', slaHours: 24, resolutionNotes: 'Password berhasil direset dan dikirim via SMS.', createdAt: new Date('2026-01-11T09:00:00Z'), updatedAt: new Date('2026-01-11T10:30:00Z') },
      ]);
    }

    const existingAssets = await db.select().from(assetsTable).limit(1);
    if (existingAssets.length === 0) {
      await db.insert(assetsTable).values([
        { assetId: 'AST-001', name: 'Dell Latitude 5520', category: 'laptop', status: 'active', serialNumber: 'DL5520-2024-001', purchaseDate: '2024-03-15', warrantyExpiry: '2027-03-15', assignedTo: 'Ahmad Fauzi', department: 'Finance', location: 'Gedung A - Lt. 3', licenseKey: '', licenseExpiry: '', notes: 'Laptop utama divisi Finance' },
        { assetId: 'AST-002', name: 'HP EliteDesk 800 G6', category: 'desktop', status: 'active', serialNumber: 'HP800G6-2023-042', purchaseDate: '2023-06-20', warrantyExpiry: '2026-06-20', assignedTo: 'Siti Rahayu', department: 'Marketing', location: 'Gedung A - Lt. 2', licenseKey: '', licenseExpiry: '', notes: 'Desktop untuk divisi Marketing' },
        { assetId: 'AST-003', name: 'HP LaserJet Pro M404dn', category: 'printer', status: 'maintenance', serialNumber: 'HPM404-2022-015', purchaseDate: '2022-01-10', warrantyExpiry: '2025-01-10', assignedTo: 'Shared - Divisi HR', department: 'HR', location: 'Gedung B - Lt. 1', licenseKey: '', licenseExpiry: '', notes: 'Perlu ganti toner' },
        { assetId: 'AST-004', name: 'Cisco Catalyst 2960', category: 'network', status: 'active', serialNumber: 'CC2960-2021-003', purchaseDate: '2021-08-05', warrantyExpiry: '2024-08-05', assignedTo: 'IT Team', department: 'IT', location: 'Gedung A - Basement', licenseKey: '', licenseExpiry: '', notes: 'Switch utama lantai 1-3' },
        { assetId: 'AST-005', name: 'Dell PowerEdge R740', category: 'server', status: 'active', serialNumber: 'DPE740-2023-001', purchaseDate: '2023-02-28', warrantyExpiry: '2028-02-28', assignedTo: 'Data Center', department: 'IT', location: 'Server Room - Rack A1', licenseKey: '', licenseExpiry: '', notes: 'Server database utama' },
        { assetId: 'AST-006', name: 'LG UltraWide 34WN80C', category: 'monitor', status: 'active', serialNumber: 'LG34WN-2024-008', purchaseDate: '2024-01-15', warrantyExpiry: '2027-01-15', assignedTo: 'Dedi Kurniawan', department: 'Engineering', location: 'Gedung A - Lt. 4', licenseKey: '', licenseExpiry: '', notes: 'Monitor untuk engineering team' },
        { assetId: 'AST-007', name: 'Logitech MX Master 3', category: 'peripheral', status: 'retired', serialNumber: 'LGMX3-2022-025', purchaseDate: '2022-05-20', warrantyExpiry: '2024-05-20', assignedTo: 'Stock', department: 'IT', location: 'Gudang IT', licenseKey: '', licenseExpiry: '', notes: 'Scroll wheel rusak - perlu penggantian' },
        { assetId: 'AST-008', name: 'Microsoft 365 Business', category: 'software', status: 'active', serialNumber: 'MS365-2024-CORP', purchaseDate: '2024-01-01', warrantyExpiry: '2025-01-01', assignedTo: 'All Employees', department: 'IT', location: 'Cloud', licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-CORP', licenseExpiry: '2025-01-01', notes: 'Lisensi 50 user - renewal Januari 2026' },
      ]);
    }

    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database init error:', err);
  }
}

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
  });
});
