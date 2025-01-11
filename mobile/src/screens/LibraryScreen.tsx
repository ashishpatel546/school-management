import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  copiesAvailable: number;
  description?: string;
  publisher?: string;
  publishedYear?: number;
}

interface BookLoan {
  id: string;
  book: Book;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

const LibraryScreen = () => {
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.API_URL}/library/loans/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch book loans');
      }

      const data = await response.json();
      setLoans(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLoans();
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
      <Text style={styles.title}>Library</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {loans.filter(loan => loan.status === 'borrowed').length}
          </Text>
          <Text style={styles.statLabel}>Borrowed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {loans.filter(loan => loan.status === 'overdue').length}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {loans.filter(loan => loan.status === 'returned').length}
          </Text>
          <Text style={styles.statLabel}>Returned</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {loans.map((loan) => (
          <View
            key={loan.id}
            style={[
              styles.loanItem,
              {
                backgroundColor:
                  loan.status === 'returned'
                    ? '#e6ffe6'
                    : loan.status === 'overdue'
                    ? '#ffe6e6'
                    : 'white',
              },
            ]}
          >
            <View>
              <Text style={styles.bookTitle}>{loan.book.title}</Text>
              <Text style={styles.bookAuthor}>by {loan.book.author}</Text>
              <Text style={styles.bookInfo}>
                ISBN: {loan.book.isbn}
              </Text>
              <View style={styles.dateContainer}>
                <Text style={styles.dateInfo}>
                  Borrowed: {new Date(loan.borrowedDate).toLocaleDateString()}
                </Text>
                <Text style={styles.dateInfo}>
                  Due: {new Date(loan.dueDate).toLocaleDateString()}
                </Text>
                {loan.returnedDate && (
                  <Text style={styles.dateInfo}>
                    Returned: {new Date(loan.returnedDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      loan.status === 'returned'
                        ? '#008000'
                        : loan.status === 'overdue'
                        ? '#ff0000'
                        : '#ffa500',
                  },
                ]}
              >
                {loan.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
        {loans.length === 0 && (
          <Text style={styles.emptyText}>No book loans found</Text>
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
  loanItem: {
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
  bookTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  bookInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dateContainer: {
    marginTop: 8,
  },
  dateInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default LibraryScreen;
