import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

const LoadingGate = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingGate />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

export default App;
