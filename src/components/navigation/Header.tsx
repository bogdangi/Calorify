import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, WifiOff } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <div className="app-title-group">
        <div className="app-logo">
          <Flame size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="app-brand">Calorify</h1>
        </div>
      </div>
      <div className="badge-offline" title={t('app.offlineReady')}>
        <WifiOff size={13} />
        <span>{t('app.offlineReady')}</span>
      </div>
    </header>
  );
};
