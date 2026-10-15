import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';
import { analytics } from '@/services';

import App from './App.tsx';

analytics.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
