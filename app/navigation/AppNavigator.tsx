import { Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LibraryScreen from '../screens/LibraryScreen'
import SearchScreen from '../screens/SearchScreen'
import GameDetailScreen from '../screens/GameDetailScreen'
import { useColors, getTabBarStyle } from '../theme'

import type { LibraryStackParamList, SearchStackParamList } from '../types'

const LibraryStack = createNativeStackNavigator<LibraryStackParamList>()
const SearchStack  = createNativeStackNavigator<SearchStackParamList>()

function LibraryNavigator() {
  const colors = useColors()
  return (
    <LibraryStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <LibraryStack.Screen
        name="LibraryHome"
        component={LibraryScreen}
        options={{ headerShown: false }}
      />
      <LibraryStack.Screen
        name="GameDetail"
        component={GameDetailScreen}
        options={{ title: 'Game Detail' }}
      />
    </LibraryStack.Navigator>
  )
}

function SearchNavigator() {
  const colors = useColors()
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <SearchStack.Screen
        name="SearchHome"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="GameDetail"
        component={GameDetailScreen}
        options={{ title: 'Game Detail' }}
      />
    </SearchStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

export default function AppNavigator() {
  const colors = useColors()
  const tabBarStyle = getTabBarStyle(colors)

  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.card, text: colors.text, border: colors.border, primary: colors.accent, notification: colors.accent } }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.placeholder,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 2,
          },
        }}
      >
        <Tab.Screen
          name="Shelf"
          component={LibraryNavigator}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'library' : 'library-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Discover"
          component={SearchNavigator}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
