import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
const tenantMode = true;
import TenantNavigation from './navigation/Tenant';
import LandlordNavigation from './navigation/Tenant';
import { store } from './store';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    if (tenantMode) {
      return (
        <Provider store={store}>
          <SafeAreaProvider>
            <TenantNavigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </Provider>
      );
    }
    else {
      return (
        <SafeAreaProvider>
          <LandlordNavigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      );
    }
  }
}
