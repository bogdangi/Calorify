import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './styles/index.css';
import App from './App';
import { settingsRepository } from './db/repositories/settingsRepository';

// Seed the settings row before the app renders (liveQuery is read-only).
settingsRepository.ensureSettings();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
