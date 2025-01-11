import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'holiday' | 'exam' | 'activity' | 'other';
  isAllDay: boolean;
}

const CalendarScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.API_URL}/calendar/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add padding for days from previous month
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift(prevDate);
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add padding for days from next month
    const endPadding = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return date >= eventStart && date <= eventEnd;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Calendar</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.calendarHeader}>
        <TouchableOpacity
          onPress={() =>
            setSelectedDate(
              new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() - 1
              )
            )
          }
        >
          <Text style={styles.navigationButton}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {selectedDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <TouchableOpacity
          onPress={() =>
            setSelectedDate(
              new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1
              )
            )
          }
        >
          <Text style={styles.navigationButton}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
        {getDaysInMonth(selectedDate).map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = date.getMonth() === selectedDate.getMonth();

          return (
            <View
              key={index}
              style={[
                styles.dayCell,
                !isCurrentMonth && styles.otherMonthDay,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  !isCurrentMonth && styles.otherMonthDayText,
                ]}
              >
                {date.getDate()}
              </Text>
              {dayEvents.map((event) => (
                <View
                  key={event.id}
                  style={[
                    styles.eventIndicator,
                    {
                      backgroundColor:
                        event.type === 'holiday'
                          ? '#ffcdd2'
                          : event.type === 'exam'
                          ? '#fff9c4'
                          : event.type === 'activity'
                          ? '#c8e6c9'
                          : '#bbdefb',
                    },
                  ]}
                >
                  <Text style={styles.eventText} numberOfLines={1}>
                    {event.title}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>

      <View style={styles.upcomingEvents}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {events
          .filter(
            (event) =>
              new Date(event.startDate) >= new Date()
          )
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() -
              new Date(b.startDate).getTime()
          )
          .map((event) => (
            <View
              key={event.id}
              style={[
                styles.eventCard,
                {
                  backgroundColor:
                    event.type === 'holiday'
                      ? '#ffebee'
                      : event.type === 'exam'
                      ? '#fffde7'
                      : event.type === 'activity'
                      ? '#e8f5e9'
                      : '#e3f2fd',
                },
              ]}
            >
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription}>
                {event.description}
              </Text>
              <Text style={styles.eventDate}>
                {new Date(event.startDate).toLocaleDateString()} -{' '}
                {new Date(event.endDate).toLocaleDateString()}
              </Text>
              <Text style={styles.eventType}>
                {event.type.toUpperCase()}
              </Text>
            </View>
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  navigationButton: {
    fontSize: 16,
    color: '#007AFF',
    padding: 10,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '500',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  dayHeader: {
    width: '14.28%',
    padding: 10,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontWeight: '500',
    color: '#666',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  otherMonthDay: {
    backgroundColor: '#f8f8f8',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  otherMonthDayText: {
    color: '#ccc',
  },
  eventIndicator: {
    marginTop: 2,
    padding: 2,
    borderRadius: 3,
  },
  eventText: {
    fontSize: 10,
  },
  upcomingEvents: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
  },
  eventCard: {
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
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  eventType: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
  },
});

export default CalendarScreen;
