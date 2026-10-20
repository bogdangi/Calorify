import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/navigation/Header';
import { BottomNav, type NavTab } from './components/navigation/BottomNav';
import { TodayPage } from './pages/TodayPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { WeightPage } from './pages/WeightPage';
import { SettingsPage } from './pages/SettingsPage';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="app-container">
      <Header />

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <aside
          role="region"
          aria-label={t('app.installPrompt')}
          style={{
            margin: '8px 16px',
            padding: '12px 14px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Download size={20} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              {t('app.installPrompt')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto' }}
              onClick={handleInstallClick}
            >
              {t('app.installButton')}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowInstallBanner(false)}
              aria-label={t('app.dismiss')}
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* Main Tab Content */}
      <main id="main-content">
        {currentTab === 'today' && <TodayPage />}
        {currentTab === 'statistics' && <StatisticsPage />}
        {currentTab === 'weight' && <WeightPage />}
        {currentTab === 'settings' && <SettingsPage />}
      </main>

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
