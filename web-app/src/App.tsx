import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import queryClient from './config/queryClient.ts';
import { Suspense } from 'react';
import { NotifierContextProvider } from './contexts/NotifierContext.tsx';
import { GlobalContextProvider } from './contexts/GlobalContext.tsx';
import Routes from './Routes.tsx';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider>
          <NotifierContextProvider>
            <Suspense fallback={null}>
              <Routes />
            </Suspense>
          </NotifierContextProvider>
        </GlobalContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
