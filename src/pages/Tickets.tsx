import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Ticket, X } from 'lucide-react';
import { Ticket as TicketType, TicketStatus, TicketPriority } from '../types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useLocalize } from '../hooks/useLocalize';

interface TicketsProps {
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account', 'Printer', 'Access', 'ServiceRequest', 'Other'];
const SLA_OPTIONS = [4, 8, 24, 48, 72];
const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'critical'];
const STATUSES: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

const emptyForm = {
  title: '',
  description: '',
  category: 'Hardware',
  priority: 'medium' as TicketPriority,
  status: 'open' as TicketStatus,
  division: '',
  requesterName: '',
  requesterEmail: '',
  assignedTo: '',
  slaHours: 24,
  resolutionNotes: '',
};

export default function Tickets({ addToast }: TicketsProps) {
  const { t } = useTranslation();
  const { localizeDiv, localizeName, localizeTitle } = useLocalize();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<TicketType | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      addToast('error', t('toast.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.title.toLowerCase().includes(q) ||
      ticket.ticketId.toLowerCase().includes(q) ||
      ticket.requesterName.toLowerCase().includes(q) ||
      ticket.division.toLowerCase().includes(q) ||
      localizeTitle(ticket.title).toLowerCase().includes(q) ||
      localizeDiv(ticket.division).toLowerCase().includes(q) ||
      localizeName(ticket.requesterName).toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenModal = (ticket?: TicketType) => {
    if (ticket) {
      setEditingTicket(ticket);
      setFormData({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        division: ticket.division,
        requesterName: ticket.requesterName,
        requesterEmail: ticket.requesterEmail,
        assignedTo: ticket.assignedTo,
        slaHours: ticket.slaHours,
        resolutionNotes: ticket.resolutionNotes,
      });
    } else {
      setEditingTicket(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTicket(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTicket) {
        const res = await fetch(`/api/tickets/${editingTicket.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setTickets(prev => prev.map(tk => tk.id === editingTicket.id ? updated : tk));
        addToast('success', t('toast.ticketUpdated'));
      } else {
        const res = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setTickets(prev => [created, ...prev]);
        addToast('success', t('toast.ticketCreated'));
      }
      handleCloseModal();
    } catch {
      addToast('error', t('toast.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/tickets/${deleteConfirm.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setTickets(prev => prev.filter(tk => tk.id !== deleteConfirm.id));
      addToast('success', t('toast.ticketDeleted'));
    } catch {
      addToast('error', t('toast.error'));
    } finally {
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), 'd MMM yyyy'); } catch { return dateStr; }
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
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{t('ticket.listTitle')}</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            <span>{t('ticket.createNew')}</span>
          </button>
        </div>
        <div className="card-body">
          <div className="search-filter">
            <div className="search-input">
              <Search size={18} />
              <input
                type="text"
                placeholder={t('ticket.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">{t('ticket.allStatus')}</option>
              {STATUSES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
            </select>
            <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">{t('ticket.allPriority')}</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{t(`priority.${p}`)}</option>)}
            </select>
          </div>
        </div>
        <div className="table-container">
          {filteredTickets.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.id')}</th>
                  <th>{t('ticket.title')}</th>
                  <th className="hide-mobile">{t('ticket.division')}</th>
                  <th className="hide-mobile">{t('ticket.requester')}</th>
                  <th className="hide-mobile">{t('ticket.assignedTo')}</th>
                  <th>{t('ticket.priority')}</th>
                  <th>{t('ticket.status')}</th>
                  <th className="hide-mobile">{t('ticket.slaLabel')}</th>
                  <th className="hide-mobile">{t('common.date')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.ticketId}</strong></td>
                    <td>
                      <div>{localizeTitle(ticket.title)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {t(`cat.${ticket.category}`) || ticket.category}
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <span className="badge-division">{localizeDiv(ticket.division)}</span>
                    </td>
                    <td className="hide-mobile">{localizeName(ticket.requesterName)}</td>
                    <td className="hide-mobile">{ticket.assignedTo ? localizeName(ticket.assignedTo) : '—'}</td>
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
                    <td className="hide-mobile">
                      <span className="sla-badge">{ticket.slaHours}h</span>
                    </td>
                    <td className="hide-mobile">{formatDate(ticket.createdAt)}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => handleOpenModal(ticket)} title={t('common.edit')}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm(ticket)} title={t('common.delete')}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <Ticket size={48} />
              <h3>{t('ticket.noTickets')}</h3>
              <p>{t('ticket.noTicketsDesc')}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingTicket ? t('ticket.editTitle') : t('ticket.newTicket')}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <p className="form-hint">{t('common.requiredFields')}</p>
                <div className="form-group">
                  <label className="form-label">{t('ticket.title')} *</label>
                  <input type="text" className="form-input" value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required placeholder={t('ticket.title')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('ticket.description')} *</label>
                  <textarea className="form-textarea" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required rows={3} placeholder={t('ticket.description')} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('ticket.requesterName')} *</label>
                    <input type="text" className="form-input" value={formData.requesterName}
                      onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                      required placeholder={t('ticket.requesterName')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('ticket.division')}</label>
                    <input type="text" className="form-input" value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      placeholder={t('ticket.division')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('ticket.requesterEmail')}</label>
                    <input type="email" className="form-input" value={formData.requesterEmail}
                      onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                      placeholder="email@company.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('ticket.assignedTo')}</label>
                    <input type="text" className="form-input" value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      placeholder={t('ticket.assignedTo')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('ticket.category')}</label>
                    <select className="form-select" value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{t(`cat.${c}`)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('ticket.priority')}</label>
                    <select className="form-select" value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{t(`priority.${p}`)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('ticket.sla')}</label>
                    <select className="form-select" value={formData.slaHours}
                      onChange={(e) => setFormData({ ...formData, slaHours: parseInt(e.target.value) })}>
                      {SLA_OPTIONS.map(h => <option key={h} value={h}>{t(`sla.${h}`)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('ticket.status')}</label>
                    <select className="form-select" value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TicketStatus })}>
                      {STATUSES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                    </select>
                  </div>
                </div>
                {(formData.status === 'resolved' || formData.status === 'closed') && (
                  <div className="form-group">
                    <label className="form-label">{t('ticket.resolutionNotes')}</label>
                    <textarea className="form-textarea" value={formData.resolutionNotes}
                      onChange={(e) => setFormData({ ...formData, resolutionNotes: e.target.value })}
                      rows={3} placeholder={t('ticket.resolutionNotes')} />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? t('common.loading') : editingTicket ? t('common.save') : t('ticket.createNew')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3 className="modal-title">{t('common.confirm')}</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p>{t('ticket.deleteConfirm')} <strong>{deleteConfirm.ticketId}</strong>?</p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {t('common.cannotUndo')}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</button>
              <button className="btn btn-danger" onClick={handleDelete}>{t('common.delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
