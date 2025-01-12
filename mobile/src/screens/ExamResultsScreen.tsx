import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExamResult {
  id: string;
  exam: {
    name: string;
    date: string;
  };
  subject: {
    name: string;
    code: string;
  };
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  rank?: number;
  teacherRemarks?: string;
  class: {
    grade: number;
    section: string;
  };
}

const ExamResultsScreen = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.API_URL}/exam-results`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exam results');
      }

      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  const handleDownloadResult = async (resultId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.API_URL}/exam-results/${resultId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download result');
      }

      // Handle PDF download based on platform
      const blob = await response.blob();
      // Implementation for handling downloaded PDF will depend on the platform
      // and the PDF viewer library being used
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download result');
    }
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
      <Text style={styles.title}>Exam Results</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {results.length}
          </Text>
          <Text style={styles.statLabel}>Total Exams</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length || 0}%
          </Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {results.map((result) => (
          <TouchableOpacity
            key={result.id}
            style={styles.resultItem}
            onPress={() => handleDownloadResult(result.id)}
          >
            <View>
              <Text style={styles.examName}>{result.exam.name}</Text>
              <Text style={styles.subjectInfo}>
                {result.subject.name} ({result.subject.code})
              </Text>
              <Text style={styles.dateText}>
                {new Date(result.exam.date).toLocaleDateString()}
              </Text>
              <View style={styles.marksContainer}>
                <Text style={styles.marksText}>
                  Marks: {result.marksObtained}/{result.totalMarks}
                </Text>
                <Text style={styles.percentageText}>
                  {result.percentage}%
                </Text>
              </View>
              {result.rank && (
                <Text style={styles.rankText}>Rank: {result.rank}</Text>
              )}
              {result.teacherRemarks && (
                <Text style={styles.remarksText}>
                  Remarks: {result.teacherRemarks}
                </Text>
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
  resultItem: {
    backgroundColor: 'white',
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
  examName: {
    fontSize: 18,
    fontWeight: '500',
  },
  subjectInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  marksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  marksText: {
    fontSize: 16,
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#008000',
  },
  rankText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  remarksText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default ExamResultsScreen;
