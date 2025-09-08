import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { VisionCameraCodeScanner } from './src/VisionCameraCodeScanner';
import { BarcodeScannerHookExamplePage } from './src/BarcodeScannerHookExamplePage';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <BarcodeScannerHookExamplePage />
    </SafeAreaProvider>
  );
}

export default App;
