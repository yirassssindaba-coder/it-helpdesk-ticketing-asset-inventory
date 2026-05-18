export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type AssetStatus = 'active' | 'maintenance' | 'retired' | 'disposed';
export type AssetCategory = 'laptop' | 'desktop' | 'printer' | 'network' | 'server' | 'monitor' | 'peripheral' | 'software';

export interface Ticket {
  id: number;
  ticketId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  division: string;
  requesterName: string;
  requesterEmail: string;
  assignedTo: string;
  slaHours: number;
  resolutionNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: number;
  assetId: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  assignedTo: string;
  department: string;
  location: string;
  licenseKey: string;
  licenseExpiry: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalAssets: number;
  activeAssets: number;
  maintenanceAssets: number;
}
