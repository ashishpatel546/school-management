import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/config';

interface Attendance {
  id: string;
  date: string;
  present: boolean;
  class: {
    grade: number;
    section: string;
  };
  markedBy: {
    firstName: string;
    lastName: string;
  };
}

const AttendanceScreen = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${API_URL}/attendance/student`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }

      const data = await response.json();
      setAttendance(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.present).length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    return {
      total,
      present,
      absent: total - present,
      percentage: percentage.toFixed(1),
    };
  };

  const stats = calculateStats();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Attendance</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Days</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.present}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.absent}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.percentage}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {attendance.map((record) => (
          <View
            key={record.id}
            style={[
              styles.attendanceItem,
              {
                backgroundColor: record.present ? '#e6ffe6' : '#ffe6e6',
              },
            ]}
          >
            <View style={styles.attendanceHeader}>
              <Text style={styles.dateText}>
                {new Date(record.date).toLocaleDateString()}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  { color: record.present ? '#008000' : '#ff0000' },
                ]}
              >
                {record.present ? 'PRESENT' : 'ABSENT'}
              </Text>
            </View>
            <Text style={styles.classInfo}>
              Class {record.class.grade}-{record.class.section}
            </Text>
            <Text style={styles.teacherInfo}>
              Marked by: {record.markedBy.firstName} {record.markedBy.lastName}
            </Text>
          </View>
        ))}
        {attendance.length === 0 && (
          <Text style={styles.emptyText}>No attendance records found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statBox: {
    alignItems: 'center',
    width: '25%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 10,
  },
  attendanceItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  classInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  teacherInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default AttendanceScreen;
