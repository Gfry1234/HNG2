import { TransactionItem } from '@/components/common/TransactionItem';
import { useAppStore } from '@/context/appStore';
import { CurrencyUtils } from '@/utils/currencyUtils';
import { TransactionUtils } from '@/utils/transactionUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, livenessVerified, initialize, user } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useFocusEffect(
    useCallback(() => {
      if (!livenessVerified && summary) {
        navigation.navigate('liveness');
      }
    }, [livenessVerified, navigation, summary])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    initialize().finally(() => setRefreshing(false));
  }, [initialize]);

  const recentTransactions = TransactionUtils.sortByDate(transactions).slice(0, 5);

  if (!summary) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: isDark ? '#A1A1A6' : '#666' }]}>
            Welcome back
          </Text>
          <Text style={[styles.userName, { color: isDark ? '#F2F2F7' : '#000' }]}>
            {user?.name || 'User'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('settings')}
          style={styles.settingsButton}
        >
          <MaterialCommunityIcons
            name="cog"
            size={24}
            color={isDark ? '#F2F2F7' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1C1C1E' : '#007AFF' }]}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text
          style={[
            styles.balanceAmount,
            {
              color: summary.balance >= 0 ? '#34C759' : '#FF3B30',
            },
          ]}
        >
          {CurrencyUtils.formatCurrency(summary.balance, summary.currency)}
        </Text>

        <View style={styles.balanceDetails}>
          <View style={styles.balanceDetail}>
            <MaterialCommunityIcons name="plus-circle" size={16} color="#34C759" />
            <Text style={styles.balanceDetailText}>
              Income: {CurrencyUtils.formatCurrency(summary.totalIncome, summary.currency)}
            </Text>
          </View>
          <View style={styles.balanceDetail}>
            <MaterialCommunityIcons name="minus-circle" size={16} color="#FF3B30" />
            <Text style={styles.balanceDetailText}>
              Expenses: {CurrencyUtils.formatCurrency(summary.totalExpenses, summary.currency)}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
          onPress={() => navigation.navigate('addTransaction')}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#007AFF" />
          <Text style={[styles.quickActionText, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
          onPress={() => navigation.navigate('analytics')}
        >
          <MaterialCommunityIcons name="chart-pie" size={24} color="#34C759" />
          <Text style={[styles.quickActionText, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}
          onPress={() => navigation.navigate('budgets')}
        >
          <MaterialCommunityIcons name="target" size={24} color="#FF9500" />
          <Text style={[styles.quickActionText, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Budgets
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Recent Transactions
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() =>
                navigation.navigate('transactionDetail', { id: transaction.id })
              }
            />
          ))
        ) : (
          <Text style={[styles.emptyText, { color: isDark ? '#A1A1A6' : '#666' }]}>
            No transactions yet. Add your first transaction!
          </Text>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
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
    paddingTop: 20,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 20,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceDetailText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 12,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
});
