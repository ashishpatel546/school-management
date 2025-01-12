import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const menuItems = [
    { title: 'Attendance', icon: '📋', route: 'Attendance' },
    { title: 'Homework', icon: '📚', route: 'Homework' },
    { title: 'Exam Results', icon: '📝', route: 'ExamResults' },
    { title: 'Fee Details', icon: '💰', route: 'FeeDetails' },
    { title: 'Bus Tracking', icon: '🚌', route: 'BusTracking' },
    { title: 'Chat', icon: '💬', route: 'Chat' },
    { title: 'Library', icon: '📖', route: 'Library' },
    { title: 'Calendar', icon: '📅', route: 'Calendar' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>School Management</Text>
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route as keyof RootStackParamList)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  menuItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: 'white',
    margin: '2.5%',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;
