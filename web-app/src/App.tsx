import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import queryClient from './config/queryClient.ts';
import { Suspense } from 'react';
import { NotifierContextProvider } from './contexts/NotifierContext.tsx';
import Routes from './Routes.tsx';
import GlobalNotifier from './helpers/GlobalNotifier.tsx';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <NotifierContextProvider>
          <Suspense fallback={null}>
            <Routes />
          </Suspense>
          <GlobalNotifier />
        </NotifierContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
