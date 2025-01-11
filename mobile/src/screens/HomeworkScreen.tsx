import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: {
    name: string;
    code: string;
  };
  totalMarks: number;
  isSubmitted?: boolean;
  submissionDate?: string;
  marks?: number;
  teacherFeedback?: string;
}

const HomeworkScreen = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssignments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${process.env.API_URL}/homework/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
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
      <Text style={styles.title}>Homework</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {assignments.filter((a) => !a.isSubmitted && new Date(a.dueDate) > new Date()).length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {assignments.filter((a) => a.isSubmitted).length}
          </Text>
          <Text style={styles.statLabel}>Submitted</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {assignments.filter((a) => !a.isSubmitted && new Date(a.dueDate) < new Date()).length}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {assignments.map((assignment) => (
          <TouchableOpacity
            key={assignment.id}
            style={[
              styles.assignmentItem,
              {
                backgroundColor: assignment.isSubmitted
                  ? '#e6ffe6'
                  : new Date(assignment.dueDate) < new Date()
                  ? '#ffe6e6'
                  : 'white',
              },
            ]}
          >
            <View>
              <Text style={styles.assignmentTitle}>{assignment.title}</Text>
              <Text style={styles.subjectInfo}>
                {assignment.subject.name} ({assignment.subject.code})
              </Text>
              <Text style={styles.dueDate}>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </Text>
              {assignment.isSubmitted && (
                <>
                  <Text style={styles.submissionInfo}>
                    Submitted: {new Date(assignment.submissionDate!).toLocaleDateString()}
                  </Text>
                  {assignment.marks !== undefined && (
                    <Text style={styles.marks}>
                      Marks: {assignment.marks}/{assignment.totalMarks}
                    </Text>
                  )}
                  {assignment.teacherFeedback && (
                    <Text style={styles.feedback}>
                      Feedback: {assignment.teacherFeedback}
                    </Text>
                  )}
                </>
              )}
            </View>
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
  statsContainer: {
    flexDirection: 'row',
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
  assignmentItem: {
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
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  subjectInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  submissionInfo: {
    fontSize: 14,
    color: '#008000',
    marginTop: 4,
  },
  marks: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  feedback: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default HomeworkScreen;
