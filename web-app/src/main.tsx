import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClientProvider } from 'react-query';
import queryClient from './config/queryClient.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </React.StrictMode>
  </QueryClientProvider>,
);
