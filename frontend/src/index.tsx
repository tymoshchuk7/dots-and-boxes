import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import SocketCtxProvider from './contexts/socketConnection';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <SocketCtxProvider>
          <App />
        </SocketCtxProvider>
      </React.StrictMode>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);

reportWebVitals(console.log);
