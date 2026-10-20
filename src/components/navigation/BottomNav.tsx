import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, BarChart3, Scale, Settings } from 'lucide-react';

export type NavTab = 'today' | 'statistics' | 'weight' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav" aria-label="Main Navigation">
      <button
        type="button"
        className={`nav-item ${currentTab === 'today' ? 'active' : ''}`}
        onClick={() => onTabChange('today')}
        aria-label={t('a11y.navToday')}
        aria-current={currentTab === 'today' ? 'page' : undefined}
      >
        <Calendar className="nav-icon" />
        <span>{t('nav.today')}</span>
      </button>

      <button
        type="button"
        className={`nav-item ${currentTab === 'statistics' ? 'active' : ''}`}
        onClick={() => onTabChange('statistics')}
        aria-label={t('a11y.navStats')}
        aria-current={currentTab === 'statistics' ? 'page' : undefined}
      >
        <BarChart3 className="nav-icon" />
        <span>{t('nav.statistics')}</span>
      </button>

      <button
        type="button"
        className={`nav-item ${currentTab === 'weight' ? 'active' : ''}`}
        onClick={() => onTabChange('weight')}
        aria-label={t('a11y.navWeight')}
        aria-current={currentTab === 'weight' ? 'page' : undefined}
      >
        <Scale className="nav-icon" />
        <span>{t('nav.weight')}</span>
      </button>

      <button
        type="button"
        className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange('settings')}
        aria-label={t('a11y.navSettings')}
        aria-current={currentTab === 'settings' ? 'page' : undefined}
      >
        <Settings className="nav-icon" />
        <span>{t('nav.settings')}</span>
      </button>
    </nav>
  );
};
