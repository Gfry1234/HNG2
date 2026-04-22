import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/context/appStore';
import { TransactionUtils } from '@/utils/transactionUtils';
import { TransactionItem } from '@/components/common/TransactionItem';
import { Button } from '@/components/common/Button';

export const TransactionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const { transactions, loading, deleteTransaction } = useAppStore();

  const filtered = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={isDark ? '#F2F2F7' : '#000'}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Transactions
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('addTransaction')}>
          <MaterialCommunityIcons
            name="plus"
            size={28}
            color={isDark ? '#F2F2F7' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContentContainer}
      >
        {(['all', 'income', 'expense'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filterType === type && styles.filterButtonActive,
              {
                backgroundColor: filterType === type ? '#007AFF' : isDark ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
            onPress={() => setFilterType(type)}
          >
            <Text
              style={[
                styles.filterButtonText,
                { color: filterType === type ? '#fff' : isDark ? '#F2F2F7' : '#000' },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[
            styles.sortOption,
            sortBy === 'date' && styles.sortOptionActive,
          ]}
          onPress={() => setSortBy('date')}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={sortBy === 'date' ? '#007AFF' : isDark ? '#A1A1A6' : '#666'}
          />
          <Text
            style={[
              styles.sortOptionText,
              { color: sortBy === 'date' ? '#007AFF' : isDark ? '#A1A1A6' : '#666' },
            ]}
          >
            Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortOption,
            sortBy === 'amount' && styles.sortOptionActive,
          ]}
          onPress={() => setSortBy('amount')}
        >
          <MaterialCommunityIcons
            name="cash"
            size={16}
            color={sortBy === 'amount' ? '#007AFF' : isDark ? '#A1A1A6' : '#666'}
          />
          <Text
            style={[
              styles.sortOptionText,
              { color: sortBy === 'amount' ? '#007AFF' : isDark ? '#A1A1A6' : '#666' },
            ]}
          >
            Amount
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : sorted.length > 0 ? (
          sorted.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() =>
                navigation.navigate('transactionDetail', { id: transaction.id })
              }
              onDelete={() => handleDelete(transaction.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="inbox"
              size={48}
              color={isDark ? '#A1A1A6' : '#999'}
            />
            <Text style={[styles.emptyText, { color: isDark ? '#A1A1A6' : '#666' }]}>
              No {filterType !== 'all' ? filterType : ''} transactions yet
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonActive: {},
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sortOptionActive: {},
  sortOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
});
