import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle size={20} style={{ color: 'var(--success)' }} />,
    error: <XCircle size={20} style={{ color: 'var(--danger)' }} />,
    info: <Info size={20} style={{ color: 'var(--info)' }} />,
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      {icons[toast.type]}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button 
        onClick={() => onRemove(toast.id)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          padding: '0.25rem',
          color: 'var(--text-secondary)'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
