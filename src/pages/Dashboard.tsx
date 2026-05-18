import { useState, useEffect } from 'react';
import { Ticket, Package, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { Ticket as TicketType, Asset } from '../types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useLocalize } from '../hooks/useLocalize';

interface DashboardProps {
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function Dashboard({ addToast }: DashboardProps) {
  const { t } = useTranslation();
  const { localizeDiv, localizeName, localizeTitle } = useLocalize();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/tickets').then(r => r.json()),
      fetch('/api/assets').then(r => r.json()),
    ]).then(([ticketData, assetData]) => {
      setTickets(Array.isArray(ticketData) ? ticketData : []);
      setAssets(Array.isArray(assetData) ? assetData : []);
    }).catch(() => {
      addToast('error', t('toast.error'));
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(tk => tk.status === 'open').length,
    inProgressTickets: tickets.filter(tk => tk.status === 'in_progress').length,
    resolvedTickets: tickets.filter(tk => tk.status === 'resolved' || tk.status === 'closed').length,
    totalAssets: assets.length,
    maintenanceAssets: assets.filter(a => a.status === 'maintenance').length,
  };

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), 'd MMM yyyy, HH:mm'); } catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Ticket size={24} /></div>
          <div className="stat-info"><h3>{stats.totalTickets}</h3><p>{t('dash.totalTickets')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertCircle size={24} /></div>
          <div className="stat-info"><h3>{stats.openTickets}</h3><p>{t('dash.newTickets')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><Clock size={24} /></div>
          <div className="stat-info"><h3>{stats.inProgressTickets}</h3><p>{t('dash.inProgress')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-info"><h3>{stats.resolvedTickets}</h3><p>{t('dash.resolved')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan"><Package size={24} /></div>
          <div className="stat-info"><h3>{stats.totalAssets}</h3><p>{t('dash.totalAssets')}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gray"><Wrench size={24} /></div>
          <div className="stat-info"><h3>{stats.maintenanceAssets}</h3><p>{t('dash.maintenance')}</p></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('dash.recentTickets')}</h2>
        </div>
        <div className="table-container">
          {recentTickets.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.id')}</th>
                  <th>{t('ticket.title')}</th>
                  <th className="hide-mobile">{t('ticket.division')}</th>
                  <th className="hide-mobile">{t('ticket.requester')}</th>
                  <th>{t('ticket.priority')}</th>
                  <th>{t('ticket.status')}</th>
                  <th className="hide-mobile">{t('common.date')}</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.ticketId}</strong></td>
                    <td>{localizeTitle(ticket.title)}</td>
                    <td className="hide-mobile">
                      <span className="badge-division">{localizeDiv(ticket.division)}</span>
                    </td>
                    <td className="hide-mobile">{localizeName(ticket.requesterName)}</td>
                    <td>
                      <span className={`badge badge-${ticket.priority}`}>
                        {t(`priority.${ticket.priority}`)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${ticket.status}`}>
                        {t(`status.${ticket.status}`)}
                      </span>
                    </td>
                    <td className="hide-mobile">{formatDate(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Ticket size={48} />
              <h3>{t('dash.noTickets')}</h3>
              <p>{t('dash.noTicketsDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
