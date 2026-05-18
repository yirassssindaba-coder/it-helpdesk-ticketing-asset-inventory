import { useState, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Ticket, Asset } from '../types';
import { useTranslation } from 'react-i18next';
import { useLocalize } from '../hooks/useLocalize';

function BarRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="bar-value">{value} <span className="bar-pct">({pct}%)</span></div>
    </div>
  );
}

export default function Reports() {
  const { t } = useTranslation();
  const { localizeName } = useLocalize();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/tickets').then(r => r.json()),
      fetch('/api/assets').then(r => r.json()),
    ]).then(([ticketData, assetData]) => {
      setTickets(Array.isArray(ticketData) ? ticketData : []);
      setAssets(Array.isArray(assetData) ? assetData : []);
    }).finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    open: '#ef4444', in_progress: '#f59e0b', resolved: '#22c55e', closed: '#64748b',
  };
  const priorityColors: Record<string, string> = {
    critical: '#dc2626', high: '#f97316', medium: '#eab308', low: '#22c55e',
  };
  const assetStatusColors: Record<string, string> = {
    active: '#22c55e', maintenance: '#f59e0b', retired: '#64748b', disposed: '#ef4444',
  };

  const countBy = <T extends Record<string, unknown>>(arr: T[], key: keyof T) =>
    arr.reduce<Record<string, number>>((acc, item) => {
      const val = String(item[key]);
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  const techMap = tickets.reduce<Record<string, { assigned: number; resolved: number; displayName: string }>>((acc, tk) => {
    const tech = tk.assignedTo || 'Unassigned';
    if (!acc[tech]) acc[tech] = { assigned: 0, resolved: 0, displayName: localizeName(tech) };
    acc[tech].assigned++;
    if (tk.status === 'resolved' || tk.status === 'closed') acc[tech].resolved++;
    return acc;
  }, {});

  const exportCSV = (data: object[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => `"${(row as any)[k]}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  const ticketsByStatus = countBy(tickets, 'status');
  const ticketsByPriority = countBy(tickets, 'priority');
  const ticketsByCategory = countBy(tickets, 'category');
  const assetsByStatus = countBy(assets, 'status');
  const assetsByCategory = countBy(assets, 'category');

  return (
    <div className="reports-grid">
      <div className="reports-row">
        <div className="card report-card">
          <div className="card-header">
            <h2 className="card-title"><BarChart3 size={18} style={{ marginRight: 6 }} />{t('report.ticketsByStatus')}</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => exportCSV(
              Object.entries(ticketsByStatus).map(([s, c]) => ({ [t('common.status')]: t(`status.${s}`), [t('report.count')]: c })), 'tickets-by-status.csv')}>
              <Download size={14} /> {t('common.export')}
            </button>
          </div>
          <div className="card-body">
            {tickets.length === 0
              ? <p className="report-no-data">{t('report.noData')}</p>
              : ['open', 'in_progress', 'resolved', 'closed'].map(s => (
                  <BarRow key={s} label={t(`status.${s}`)} value={ticketsByStatus[s] || 0} total={tickets.length} color={statusColors[s]} />
                ))}
          </div>
        </div>

        <div className="card report-card">
          <div className="card-header">
            <h2 className="card-title"><BarChart3 size={18} style={{ marginRight: 6 }} />{t('report.ticketsByPriority')}</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => exportCSV(
              Object.entries(ticketsByPriority).map(([p, c]) => ({ [t('ticket.priority')]: t(`priority.${p}`), [t('report.count')]: c })), 'tickets-by-priority.csv')}>
              <Download size={14} /> {t('common.export')}
            </button>
          </div>
          <div className="card-body">
            {tickets.length === 0
              ? <p className="report-no-data">{t('report.noData')}</p>
              : ['critical', 'high', 'medium', 'low'].map(p => (
                  <BarRow key={p} label={t(`priority.${p}`)} value={ticketsByPriority[p] || 0} total={tickets.length} color={priorityColors[p]} />
                ))}
          </div>
        </div>
      </div>

      <div className="reports-row">
        <div className="card report-card">
          <div className="card-header">
            <h2 className="card-title"><BarChart3 size={18} style={{ marginRight: 6 }} />{t('report.ticketsByCategory')}</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => exportCSV(
              Object.entries(ticketsByCategory).map(([c, n]) => ({ [t('ticket.category')]: t(`cat.${c}`) || c, [t('report.count')]: n })), 'tickets-by-category.csv')}>
              <Download size={14} /> {t('common.export')}
            </button>
          </div>
          <div className="card-body">
            {tickets.length === 0
              ? <p className="report-no-data">{t('report.noData')}</p>
              : Object.entries(ticketsByCategory).sort((a, b) => b[1] - a[1]).map(([cat, cnt], i) => (
                  <BarRow key={cat} label={t(`cat.${cat}`) || cat} value={cnt} total={tickets.length} color={`hsl(${i * 47}, 65%, 52%)`} />
                ))}
          </div>
        </div>

        <div className="card report-card">
          <div className="card-header">
            <h2 className="card-title"><BarChart3 size={18} style={{ marginRight: 6 }} />{t('report.techPerformance')}</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => exportCSV(
              Object.entries(techMap).map(([, v]) => ({
                [t('report.technician')]: v.displayName,
                [t('report.assigned')]: v.assigned,
                [t('report.resolved')]: v.resolved,
                [t('report.resolveRate')]: `${v.assigned > 0 ? Math.round((v.resolved / v.assigned) * 100) : 0}%`
              })), 'tech-performance.csv')}>
              <Download size={14} /> {t('common.export')}
            </button>
          </div>
          <div className="card-body">
            {Object.keys(techMap).length === 0
              ? <p className="report-no-data">{t('report.noData')}</p>
              : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('report.technician')}</th>
                      <th>{t('report.assigned')}</th>
                      <th>{t('report.resolved')}</th>
                      <th>{t('report.resolveRate')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(techMap).sort((a, b) => b[1].assigned - a[1].assigned).map(([tech, data]) => {
                      const rate = data.assigned > 0 ? Math.round((data.resolved / data.assigned) * 100) : 0;
                      return (
                        <tr key={tech}>
                          <td><strong>{data.displayName}</strong></td>
                          <td>{data.assigned}</td>
                          <td>{data.resolved}</td>
                          <td>
                            <span style={{ color: rate >= 70 ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
                              {rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>

      <div className="reports-row">
        <div className="card report-card">
          <div className="card-header">
            <h2 className="card-title"><BarChart3 size={18} style={{ marginRight: 6 }} />{t('report.assetsByStatus')}</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => exportCSV(
              Object.entries(assetsByStatus).map(([s, c]) => ({ [t('asset.status')]: t(`assetStatus.${s}`), [t('report.count')]: c })), 'assets-by-status.csv')}>
              <Download size={14} /> {t('common.export')}
            </button>
          </div>
          <div className="card-body">
            {assets.length === 0
              ? <p className="report-no-data">{t('report.noData')}</p>
              : ['active', 'maintenance', 'retired', 'disposed'].map(s => (
                  <BarRow key={s} label={t(`assetStatus.${s}`)} value={assetsByStatus[s] || 0} total={assets.length} color={assetStatusColors[s]} />
                ))}
          </div>
        </div>

        <div className="card report-card">
          <div className="card-header">
            <h2 className="card-title"><BarChart3 size={18} style={{ marginRight: 6 }} />{t('report.assetsByCategory')}</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => exportCSV(
              Object.entries(assetsByCategory).map(([c, n]) => ({ [t('asset.category')]: t(`assetCat.${c}`) || c, [t('report.count')]: n })), 'assets-by-category.csv')}>
              <Download size={14} /> {t('common.export')}
            </button>
          </div>
          <div className="card-body">
            {assets.length === 0
              ? <p className="report-no-data">{t('report.noData')}</p>
              : Object.entries(assetsByCategory).sort((a, b) => b[1] - a[1]).map(([cat, cnt], i) => (
                  <BarRow key={cat} label={t(`assetCat.${cat}`) || cat} value={cnt} total={assets.length} color={`hsl(${i * 53 + 200}, 60%, 50%)`} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
