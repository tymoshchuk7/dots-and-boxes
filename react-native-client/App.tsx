import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import CtxProvider from './contexts/socketConnection';
import AppNavigation from './screens/index';
import store from './store';


export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider>
          <CtxProvider>
            <StatusBar style="auto" />
            <AppNavigation />
          </CtxProvider>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
