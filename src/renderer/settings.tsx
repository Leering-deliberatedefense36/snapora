import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Settings } from './components/Settings';
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root');
createRoot(container).render(
  <StrictMode>
    <Settings />
  </StrictMode>,
);
