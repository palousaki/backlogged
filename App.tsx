import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigator from './app/navigation/AppNavigator'

export default function App() {
  const dark = useColorScheme() === 'dark'
  return (
    <SafeAreaProvider>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <AppNavigator />
    </SafeAreaProvider>
  )
}
