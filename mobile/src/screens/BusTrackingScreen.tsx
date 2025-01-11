import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import socketService from '../services/socket.service';

interface BusLocation {
  busId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  busNumber: string;
  driverName: string;
}

const BusTrackingScreen = () => {
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);

  useEffect(() => {
    socketService.connect();

    socketService.on('busLocationUpdate', (location: BusLocation) => {
      setBusLocations(prev => {
        const index = prev.findIndex(bus => bus.busId === location.busId);
        if (index !== -1) {
          const newLocations = [...prev];
          newLocations[index] = location;
          return newLocations;
        }
        return [...prev, location];
      });
    });

    return () => {
      socketService.off('busLocationUpdate');
      socketService.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Tracking</Text>
      <FlatList
        data={busLocations}
        keyExtractor={item => item.busId}
        renderItem={({ item }) => (
          <View style={styles.busContainer}>
            <Text style={styles.busNumber}>Bus #{item.busNumber}</Text>
            <Text style={styles.driverName}>Driver: {item.driverName}</Text>
            <Text style={styles.location}>
              Location: {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
            </Text>
            <Text style={styles.timestamp}>
              Last Updated: {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  busContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverName: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default BusTrackingScreen;
