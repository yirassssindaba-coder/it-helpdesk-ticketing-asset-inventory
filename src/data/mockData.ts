import { Ticket, Asset } from '../types';

export const initialTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Laptop tidak bisa menyala',
    description: 'Laptop Dell Latitude tidak merespon saat ditekan tombol power. Sudah dicoba charge semalaman.',
    status: 'open',
    priority: 'high',
    category: 'Hardware',
    requesterName: 'Ahmad Fauzi',
    requesterEmail: 'ahmad.fauzi@company.com',
    assignedTo: 'IT Support',
    createdAt: '2026-01-14T08:00:00Z',
    updatedAt: '2026-01-14T08:00:00Z'
  },
  {
    id: 'TKT-002',
    title: 'Install Microsoft Office',
    description: 'Mohon bantuan untuk install Microsoft Office 365 di laptop baru.',
    status: 'in_progress',
    priority: 'medium',
    category: 'Software',
    requesterName: 'Siti Rahayu',
    requesterEmail: 'siti.rahayu@company.com',
    assignedTo: 'Budi Santoso',
    createdAt: '2026-01-13T14:30:00Z',
    updatedAt: '2026-01-14T09:15:00Z'
  },
  {
    id: 'TKT-003',
    title: 'Akses VPN bermasalah',
    description: 'Tidak bisa connect ke VPN kantor dari rumah. Error message: Connection timeout.',
    status: 'resolved',
    priority: 'high',
    category: 'Network',
    requesterName: 'Dedi Kurniawan',
    requesterEmail: 'dedi.k@company.com',
    assignedTo: 'Network Admin',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-13T16:45:00Z'
  },
  {
    id: 'TKT-004',
    title: 'Printer tidak terdeteksi',
    description: 'Printer HP LaserJet tidak muncul di daftar printer. Sudah coba restart komputer.',
    status: 'open',
    priority: 'low',
    category: 'Hardware',
    requesterName: 'Rina Wati',
    requesterEmail: 'rina.wati@company.com',
    assignedTo: 'IT Support',
    createdAt: '2026-01-14T11:20:00Z',
    updatedAt: '2026-01-14T11:20:00Z'
  },
  {
    id: 'TKT-005',
    title: 'Reset password email',
    description: 'Lupa password email kantor, mohon bantuan reset.',
    status: 'closed',
    priority: 'medium',
    category: 'Account',
    requesterName: 'Joko Widodo',
    requesterEmail: 'joko.w@company.com',
    assignedTo: 'System Admin',
    createdAt: '2026-01-11T09:00:00Z',
    updatedAt: '2026-01-11T10:30:00Z'
  }
];

export const initialAssets: Asset[] = [
  {
    id: 'AST-001',
    name: 'Dell Latitude 5520',
    category: 'laptop',
    status: 'active',
    serialNumber: 'DL5520-2024-001',
    purchaseDate: '2024-03-15',
    warrantyExpiry: '2027-03-15',
    assignedTo: 'Ahmad Fauzi',
    location: 'Gedung A - Lt. 3',
    notes: 'Laptop untuk divisi Finance'
  },
  {
    id: 'AST-002',
    name: 'HP EliteDesk 800 G6',
    category: 'desktop',
    status: 'active',
    serialNumber: 'HP800G6-2023-042',
    purchaseDate: '2023-06-20',
    warrantyExpiry: '2026-06-20',
    assignedTo: 'Siti Rahayu',
    location: 'Gedung A - Lt. 2',
    notes: 'Desktop untuk resepsionis'
  },
  {
    id: 'AST-003',
    name: 'HP LaserJet Pro M404dn',
    category: 'printer',
    status: 'maintenance',
    serialNumber: 'HPM404-2022-015',
    purchaseDate: '2022-01-10',
    warrantyExpiry: '2025-01-10',
    assignedTo: 'Shared - Divisi HR',
    location: 'Gedung B - Lt. 1',
    notes: 'Perlu ganti toner'
  },
  {
    id: 'AST-004',
    name: 'Cisco Catalyst 2960',
    category: 'network',
    status: 'active',
    serialNumber: 'CC2960-2021-003',
    purchaseDate: '2021-08-05',
    warrantyExpiry: '2024-08-05',
    assignedTo: 'Server Room',
    location: 'Gedung A - Basement',
    notes: 'Switch utama lantai 1-3'
  },
  {
    id: 'AST-005',
    name: 'Dell PowerEdge R740',
    category: 'server',
    status: 'active',
    serialNumber: 'DPE740-2023-001',
    purchaseDate: '2023-02-28',
    warrantyExpiry: '2028-02-28',
    assignedTo: 'Data Center',
    location: 'Server Room - Rack A1',
    notes: 'Server database utama'
  },
  {
    id: 'AST-006',
    name: 'LG UltraWide 34WN80C',
    category: 'monitor',
    status: 'active',
    serialNumber: 'LG34WN-2024-008',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2027-01-15',
    assignedTo: 'Dedi Kurniawan',
    location: 'Gedung A - Lt. 4',
    notes: 'Monitor untuk design team'
  },
  {
    id: 'AST-007',
    name: 'Logitech MX Master 3',
    category: 'peripheral',
    status: 'retired',
    serialNumber: 'LGMX3-2022-025',
    purchaseDate: '2022-05-20',
    warrantyExpiry: '2024-05-20',
    assignedTo: 'Stock',
    location: 'Gudang IT',
    notes: 'Sudah tidak berfungsi - scroll wheel rusak'
  },
  {
    id: 'AST-008',
    name: 'Microsoft 365 Business',
    category: 'software',
    status: 'active',
    serialNumber: 'MS365-2024-CORP',
    purchaseDate: '2024-01-01',
    warrantyExpiry: '2025-01-01',
    assignedTo: 'All Employees',
    location: 'Cloud',
    notes: 'Lisensi 50 user'
  }
];
