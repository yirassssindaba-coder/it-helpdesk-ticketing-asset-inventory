import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package, X } from 'lucide-react';
import { Asset, AssetStatus, AssetCategory } from '../types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useLocalize } from '../hooks/useLocalize';

interface AssetsProps {
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const ASSET_CATEGORIES: AssetCategory[] = ['laptop', 'desktop', 'printer', 'network', 'server', 'monitor', 'peripheral', 'software'];
const ASSET_STATUSES: AssetStatus[] = ['active', 'maintenance', 'retired', 'disposed'];

const emptyForm = {
  name: '',
  category: 'laptop' as AssetCategory,
  status: 'active' as AssetStatus,
  serialNumber: '',
  purchaseDate: '',
  warrantyExpiry: '',
  assignedTo: '',
  department: '',
  location: '',
  licenseKey: '',
  licenseExpiry: '',
  notes: '',
};

export default function Assets({ addToast }: AssetsProps) {
  const { t } = useTranslation();
  const { localizeDiv, localizeName, localizeLocation } = useLocalize();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<Asset | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch {
      addToast('error', t('toast.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const filteredAssets = assets.filter((asset) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      asset.name.toLowerCase().includes(q) ||
      asset.assetId.toLowerCase().includes(q) ||
      asset.serialNumber.toLowerCase().includes(q) ||
      asset.department.toLowerCase().includes(q) ||
      localizeDiv(asset.department).toLowerCase().includes(q) ||
      localizeName(asset.assignedTo).toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenModal = (asset?: Asset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData({
        name: asset.name,
        category: asset.category,
        status: asset.status,
        serialNumber: asset.serialNumber,
        purchaseDate: asset.purchaseDate,
        warrantyExpiry: asset.warrantyExpiry,
        assignedTo: asset.assignedTo,
        department: asset.department,
        location: asset.location,
        licenseKey: asset.licenseKey,
        licenseExpiry: asset.licenseExpiry,
        notes: asset.notes,
      });
    } else {
      setEditingAsset(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAsset(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAsset) {
        const res = await fetch(`/api/assets/${editingAsset.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setAssets(prev => prev.map(a => a.id === editingAsset.id ? updated : a));
        addToast('success', t('toast.assetUpdated'));
      } else {
        const res = await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setAssets(prev => [created, ...prev]);
        addToast('success', t('toast.assetCreated'));
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
      const res = await fetch(`/api/assets/${deleteConfirm.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setAssets(prev => prev.filter(a => a.id !== deleteConfirm.id));
      addToast('success', t('toast.assetDeleted'));
    } catch {
      addToast('error', t('toast.error'));
    } finally {
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), 'd MMM yyyy'); } catch { return dateStr || '—'; }
  };

  const isWarrantyExpiring = (expiry: string) => {
    if (!expiry) return false;
    const diff = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff < 90;
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
          <h2 className="card-title">{t('asset.listTitle')}</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            <span>{t('asset.addNew')}</span>
          </button>
        </div>
        <div className="card-body">
          <div className="search-filter">
            <div className="search-input">
              <Search size={18} />
              <input type="text" placeholder={t('asset.searchPlaceholder')}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">{t('asset.allStatus')}</option>
              {ASSET_STATUSES.map(s => <option key={s} value={s}>{t(`assetStatus.${s}`)}</option>)}
            </select>
            <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">{t('asset.allCategory')}</option>
              {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{t(`assetCat.${c}`)}</option>)}
            </select>
          </div>
        </div>
        <div className="table-container">
          {filteredAssets.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.id')}</th>
                  <th>{t('asset.name')}</th>
                  <th className="hide-mobile">{t('asset.category')}</th>
                  <th>{t('asset.status')}</th>
                  <th className="hide-mobile">{t('asset.department')}</th>
                  <th className="hide-mobile">{t('asset.assignedTo')}</th>
                  <th className="hide-mobile">{t('asset.warrantyExpiry')}</th>
                  <th className="hide-mobile">{t('asset.serialNumber')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td><strong>{asset.assetId}</strong></td>
                    <td>
                      <div>{asset.name}</div>
                      {asset.licenseKey && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>🔑 {t('asset.licenseKey')}</div>
                      )}
                    </td>
                    <td className="hide-mobile">{t(`assetCat.${asset.category}`)}</td>
                    <td>
                      <span className={`badge badge-${asset.status}`}>
                        {t(`assetStatus.${asset.status}`)}
                      </span>
                    </td>
                    <td className="hide-mobile">
                      <span className="badge-division">{localizeDiv(asset.department)}</span>
                    </td>
                    <td className="hide-mobile">{localizeName(asset.assignedTo)}</td>
                    <td className="hide-mobile">
                      <span style={{ color: isWarrantyExpiring(asset.warrantyExpiry) ? 'var(--warning)' : undefined }}>
                        {formatDate(asset.warrantyExpiry)}
                        {isWarrantyExpiring(asset.warrantyExpiry) && ' ⚠️'}
                      </span>
                    </td>
                    <td className="hide-mobile" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {asset.serialNumber}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => handleOpenModal(asset)} title={t('common.edit')}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm(asset)} title={t('common.delete')}>
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
              <Package size={48} />
              <h3>{t('asset.noAssets')}</h3>
              <p>{t('asset.noAssetsDesc')}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingAsset ? t('asset.editTitle') : t('asset.addNew')}</h3>
              <button className="modal-close" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <p className="form-hint">{t('common.requiredFields')}</p>
                <div className="form-group">
                  <label className="form-label">{t('asset.name')} *</label>
                  <input type="text" className="form-input" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required placeholder={t('asset.name')} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('asset.category')} *</label>
                    <select className="form-select" value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}>
                      {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{t(`assetCat.${c}`)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('asset.status')}</label>
                    <select className="form-select" value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}>
                      {ASSET_STATUSES.map(s => <option key={s} value={s}>{t(`assetStatus.${s}`)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('asset.serialNumber')} *</label>
                    <input type="text" className="form-input" value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      required placeholder="SN-XXXX-XXXX" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('asset.department')}</label>
                    <input type="text" className="form-input" value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder={t('asset.department')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('asset.purchaseDate')}</label>
                    <input type="date" className="form-input" value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('asset.warrantyExpiry')}</label>
                    <input type="date" className="form-input" value={formData.warrantyExpiry}
                      onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('asset.assignedTo')}</label>
                    <input type="text" className="form-input" value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      placeholder={t('asset.assignedTo')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('asset.location')}</label>
                    <input type="text" className="form-input" value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={t('asset.location')} />
                  </div>
                </div>
                {formData.category === 'software' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{t('asset.licenseKey')}</label>
                      <input type="text" className="form-input" value={formData.licenseKey}
                        onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
                        placeholder="XXXXX-XXXXX-XXXXX" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('asset.licenseExpiry')}</label>
                      <input type="date" className="form-input" value={formData.licenseExpiry}
                        onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })} />
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">{t('asset.notes')}</label>
                  <textarea className="form-textarea" value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2} placeholder={t('asset.notes')} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? t('common.loading') : editingAsset ? t('common.save') : t('asset.addNew')}
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
              <p>{t('asset.deleteConfirm')} <strong>{deleteConfirm.assetId}</strong>?</p>
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
