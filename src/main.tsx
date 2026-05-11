import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { PlaybackProvider } from './playback/PlaybackContext';

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <PlaybackProvider>
        <App />
      </PlaybackProvider>
    </BrowserRouter>
  </StrictMode>,
);
