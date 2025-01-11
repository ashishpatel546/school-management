import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { API_URL } from './src/utils/config';
import { RootStackParamList } from './src/navigation/types';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import HomeworkScreen from './src/screens/HomeworkScreen';
import ExamResultsScreen from './src/screens/ExamResultsScreen';
import FeeDetailsScreen from './src/screens/FeeDetailsScreen';
import ChatScreen from './src/screens/ChatScreen';
import BusTrackingScreen from './src/screens/BusTrackingScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import CalendarScreen from './src/screens/CalendarScreen';

const Stack = createStackNavigator<RootStackParamList>();

interface Feature {
  id: string;
  name: string;
  isEnabled: boolean;
}

const App = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/features`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFeatures(data);
        }
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const isFeatureEnabled = (featureName: string) => {
    const feature = features.find(f => f.name === featureName);
    return feature?.isEnabled ?? false;
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="Homework" component={HomeworkScreen} />
          <Stack.Screen name="ExamResults" component={ExamResultsScreen} />
          <Stack.Screen name="FeeDetails" component={FeeDetailsScreen} />
          {isFeatureEnabled('chat') && (
            <Stack.Screen name="Chat" component={ChatScreen} />
          )}
          {isFeatureEnabled('transportation') && (
            <Stack.Screen name="BusTracking" component={BusTrackingScreen} />
          )}
          {isFeatureEnabled('library') && (
            <Stack.Screen name="Library" component={LibraryScreen} />
          )}
          {isFeatureEnabled('calendar') && (
            <Stack.Screen name="Calendar" component={CalendarScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
