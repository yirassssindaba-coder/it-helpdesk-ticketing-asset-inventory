import { Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Layout from './components/Layout';
import Toast, { ToastMessage } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Assets from './pages/Assets';
import Reports from './pages/Reports';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <LanguageProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard addToast={addToast} />} />
          <Route path="/tickets" element={<Tickets addToast={addToast} />} />
          <Route path="/assets" element={<Assets addToast={addToast} />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
      <Toast toasts={toasts} onRemove={removeToast} />
    </LanguageProvider>
  );
}

export default App;
