import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/context/appStore';
import { TransactionUtils } from '@/utils/transactionUtils';
import { CurrencyUtils } from '@/utils/currencyUtils';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

export const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { transactions, user } = useAppStore();
  const currency = user?.currency || 'USD';

  // Calculate summaries
  const expenseSummary = useMemo(
    () => TransactionUtils.calculateCategorySummary(transactions, 'expense'),
    [transactions]
  );

  const incomeSummary = useMemo(
    () => TransactionUtils.calculateCategorySummary(transactions, 'income'),
    [transactions]
  );

  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        months[monthKey].income += t.amount;
      } else {
        months[monthKey].expense += t.amount;
      }
    });

    return Object.entries(months)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .slice(-6) // Last 6 months
      .map(([month, data]) => ({ month, ...data }));
  }, [transactions]);

  const renderCategoryBar = (
    item: typeof expenseSummary[0],
    index: number,
    isDark: boolean
  ) => {
    const barHeight = Math.max(item.percentage, 5); // Minimum height for visibility
    const categoryColor = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7FF'][index % 5];

    return (
      <View key={item.category} style={styles.barContainer}>
        <View style={styles.barLabelContainer}>
          <Text style={[styles.barLabel, { color: isDark ? '#F2F2F7' : '#000' }]}>
            {item.category.slice(0, 6)}
          </Text>
          <Text style={[styles.barValue, { color: isDark ? '#A1A1A6' : '#666' }]}>
            {item.percentage.toFixed(1)}%
          </Text>
        </View>
        <View
          style={[
            styles.bar,
            {
              width: `${barHeight}%`,
              backgroundColor: categoryColor,
            },
          ]}
        />
        <Text style={[styles.barAmount, { color: isDark ? '#A1A1A6' : '#666' }]}>
          {CurrencyUtils.formatCurrency(item.total, currency)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
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
          Analytics
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Monthly Trend
          </Text>
          <View
            style={[
              styles.chartContainer,
              { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
            ]}
          >
            <View style={styles.monthlyChartContainer}>
              {monthlyData.map((data, index) => {
                const maxValue = Math.max(
                  ...monthlyData.map((d) => Math.max(d.income, d.expense))
                );
                const incomeHeight = (data.income / maxValue) * 150;
                const expenseHeight = (data.expense / maxValue) * 150;

                return (
                  <View key={data.month} style={styles.monthBar}>
                    <View style={styles.barsWrapper}>
                      <View
                        style={[
                          styles.incomeBar,
                          { height: incomeHeight || 5 },
                        ]}
                      />
                      <View
                        style={[
                          styles.expenseBar,
                          { height: expenseHeight || 5 },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.monthLabel,
                        { color: isDark ? '#A1A1A6' : '#666' },
                      ]}
                    >
                      {data.month.split('-')[1]}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#34C759' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#A1A1A6' : '#666' }]}>
                  Income
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FF3B30' }]} />
                <Text style={[styles.legendText, { color: isDark ? '#A1A1A6' : '#666' }]}>
                  Expenses
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Expense Breakdown */}
      {expenseSummary.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Expense Breakdown
          </Text>
          <View
            style={[
              styles.chartContainer,
              { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
            ]}
          >
            {expenseSummary.map((item, index) =>
              renderCategoryBar(item, index, isDark)
            )}
          </View>
        </View>
      )}

      {/* Income Breakdown */}
      {incomeSummary.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Income Breakdown
          </Text>
          <View
            style={[
              styles.chartContainer,
              { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
            ]}
          >
            {incomeSummary.map((item, index) =>
              renderCategoryBar(item, index, isDark)
            )}
          </View>
        </View>
      )}

      {transactions.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={48}
            color={isDark ? '#A1A1A6' : '#999'}
          />
          <Text style={[styles.emptyText, { color: isDark ? '#A1A1A6' : '#666' }]}>
            No data to display
          </Text>
          <Text style={[styles.emptySubtext, { color: isDark ? '#666' : '#999' }]}>
            Add transactions to see analytics
          </Text>
        </View>
      )}

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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chartContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  monthlyChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 16,
  },
  monthBar: {
    alignItems: 'center',
    flex: 1,
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 8,
  },
  incomeBar: {
    width: 6,
    backgroundColor: '#34C759',
    borderRadius: 3,
  },
  expenseBar: {
    width: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 3,
  },
  monthLabel: {
    fontSize: 11,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
  },
  barContainer: {
    marginVertical: 8,
  },
  barLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 12,
  },
  bar: {
    height: 24,
    borderRadius: 4,
    marginBottom: 4,
  },
  barAmount: {
    fontSize: 11,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
  },
});
