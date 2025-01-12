import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Fee {
  id: string;
  amount: number;
  extraCurriculumFee: number;
  totalAmount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
  class: {
    grade: number;
    section: string;
  };
}

const FeeDetailsScreen = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.API_URL}/fees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch fees');
      }

      const data = await response.json();
      setFees(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFees();
  };

  const handleDownloadInvoice = async (feeId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${process.env.API_URL}/fees/${feeId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      // Handle PDF download based on platform
      const blob = await response.blob();
      // Implementation for handling downloaded PDF will depend on the platform
      // and the PDF viewer library being used
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download invoice');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const totalPending = fees
    .filter(fee => fee.status === 'pending' || fee.status === 'overdue')
    .reduce((acc, fee) => acc + fee.totalAmount, 0);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Fee Details</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {fees.filter(fee => fee.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {formatCurrency(totalPending)}
          </Text>
          <Text style={styles.statLabel}>Total Due</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {fees.map((fee) => (
          <TouchableOpacity
            key={fee.id}
            style={[
              styles.feeItem,
              {
                backgroundColor:
                  fee.status === 'paid'
                    ? '#e6ffe6'
                    : fee.status === 'overdue'
                    ? '#ffe6e6'
                    : 'white',
              },
            ]}
            onPress={() => fee.status === 'paid' && handleDownloadInvoice(fee.id)}
          >
            <View>
              <View style={styles.feeHeader}>
                <Text style={styles.className}>
                  Class {fee.class.grade}-{fee.class.section}
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        fee.status === 'paid'
                          ? '#008000'
                          : fee.status === 'overdue'
                          ? '#ff0000'
                          : '#ffa500',
                    },
                  ]}
                >
                  {fee.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.dueDate}>
                Due: {new Date(fee.dueDate).toLocaleDateString()}
              </Text>
              <View style={styles.amountContainer}>
                <View>
                  <Text style={styles.amountLabel}>Base Fee</Text>
                  <Text style={styles.amountText}>
                    {formatCurrency(fee.amount)}
                  </Text>
                </View>
                {fee.extraCurriculumFee > 0 && (
                  <View>
                    <Text style={styles.amountLabel}>Extra Activities</Text>
                    <Text style={styles.amountText}>
                      {formatCurrency(fee.extraCurriculumFee)}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={styles.amountLabel}>Total</Text>
                  <Text style={styles.totalText}>
                    {formatCurrency(fee.totalAmount)}
                  </Text>
                </View>
              </View>
              {fee.paidAt && (
                <Text style={styles.paidDate}>
                  Paid on: {new Date(fee.paidAt).toLocaleDateString()}
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
  feeItem: {
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
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  className: {
    fontSize: 18,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paidDate: {
    fontSize: 14,
    color: '#008000',
    marginTop: 8,
  },
});

export default FeeDetailsScreen;
