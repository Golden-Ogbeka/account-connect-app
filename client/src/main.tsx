import { ApolloProvider } from '@apollo/client/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { apolloClient } from './apollo/client';
import App from './App';
import './index.css';
import { store } from './store';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <Toaster richColors closeButton position="top-right" />
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  </StrictMode>,
);
