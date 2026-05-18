import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Package, Menu, X, Headphones, BarChart3, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage, LANGUAGES, Language } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/tickets', icon: Ticket, label: t('nav.tickets') },
    { path: '/assets', icon: Package, label: t('nav.assets') },
    { path: '/reports', icon: BarChart3, label: t('nav.reports') },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return t('nav.dashboard');
      case '/tickets': return t('nav.tickets');
      case '/assets': return t('nav.assets');
      case '/reports': return t('nav.reports');
      default: return t('app.title');
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <div className="app-container">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Headphones size={24} />
            <div>
              <div>{t('app.title')}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 400, color: 'var(--text-secondary)', marginTop: '1px' }}>
                {t('app.subtitle')}
              </div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="lang-switcher">
            <button className="lang-btn" onClick={() => setLangMenuOpen(!langMenuOpen)}>
              <Globe size={16} />
              <span>{currentLang?.flag} {currentLang?.label}</span>
            </button>
            {langMenuOpen && (
              <div className="lang-dropdown">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => handleLangChange(lang.code)}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="topbar-title">{getPageTitle()}</h1>
          <div className="topbar-right">
            <div className="lang-switcher-top">
              <button className="lang-btn-top" onClick={() => setLangMenuOpen(!langMenuOpen)}>
                <Globe size={16} />
                <span>{currentLang?.flag}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentLang?.label}</span>
              </button>
              {langMenuOpen && (
                <div className="lang-dropdown lang-dropdown-top">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => handleLangChange(lang.code)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="page-content" onClick={() => langMenuOpen && setLangMenuOpen(false)}>
          {children}
        </div>
      </main>
    </div>
  );
}
