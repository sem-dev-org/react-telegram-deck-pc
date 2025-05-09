import { retrieveLaunchParams, isTMA } from '@telegram-apps/sdk-react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { init } from './init';

// i18n
import './i18n';

// styles
import './index.css';
import FailedToLoadPage from './pages/informationPage/failedToLoadPage.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);

(async function() {
  try {
    if (await isTMA() || import.meta.env.DEV) {
      console.log('TMA')
      // Import mockEnv only in TMA environment
      await import('./mockEnv');
      // Configure all application dependencies.
      init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);
    } 
    
    root.render(<App />);
  } catch (e) {
    console.error('Failed to initialize app:', e);
    root.render(<FailedToLoadPage />);
  }
})();
