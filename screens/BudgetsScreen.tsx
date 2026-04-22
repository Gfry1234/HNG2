import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/context/appStore';
import { BudgetUtils } from '@/utils/transactionUtils';
import { CurrencyUtils } from '@/utils/currencyUtils';
import { Button } from '@/components/common/Button';
import { Budget, TransactionCategory } from '@/types';

const CATEGORIES: TransactionCategory[] = [
  'food',
  'transport',
  'entertainment',
  'utilities',
  'shopping',
  'healthcare',
  'education',
  'rent',
  'other',
];

export const BudgetsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const { budgets, transactions, addBudget, deleteBudget, user } = useAppStore();
  const currency = user?.currency || 'USD';

  const handleAddBudget = async () => {
    try {
      if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid budget amount');
        return;
      }

      setLoading(true);

      const budget: Budget = {
        id: `budget_${Date.now()}`,
        category: selectedCategory,
        limit: parseFloat(budgetAmount),
        currency,
        period,
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      await addBudget(budget);
      Alert.alert('Success', 'Budget created successfully');
      setBudgetAmount('');
      setShowAddForm(false);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    Alert.alert('Delete Budget', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteBudget(id);
          } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to delete budget');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const currentMonthTransactions = transactions.filter((t) => {
    const now = new Date();
    const tDate = new Date(t.date);
    return (
      tDate.getMonth() === now.getMonth() &&
      tDate.getFullYear() === now.getFullYear() &&
      t.type === 'expense'
    );
  });

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
          Budgets
        </Text>
        <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
          <MaterialCommunityIcons
            name={showAddForm ? 'close' : 'plus'}
            size={28}
            color={isDark ? '#F2F2F7' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* Add Budget Form */}
      {showAddForm && (
        <View
          style={[
            styles.formContainer,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
          ]}
        >
          <Text style={[styles.formTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Create New Budget
          </Text>

          {/* Category Selection */}
          <Text style={[styles.formLabel, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryOption,
                  selectedCategory === cat && styles.categoryOptionActive,
                  {
                    backgroundColor:
                      selectedCategory === cat ? '#007AFF' : isDark ? '#2C2C2E' : '#fff',
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    { color: selectedCategory === cat ? '#fff' : isDark ? '#F2F2F7' : '#000' },
                  ]}
                >
                  {cat.slice(0, 4)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Amount Input */}
          <Text style={[styles.formLabel, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Budget Limit
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#2C2C2E' : '#fff',
                color: isDark ? '#F2F2F7' : '#000',
                borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
              },
            ]}
            placeholder="0.00"
            placeholderTextColor={isDark ? '#666' : '#999'}
            keyboardType="decimal-pad"
            value={budgetAmount}
            onChangeText={setBudgetAmount}
          />

          {/* Period Selection */}
          <Text style={[styles.formLabel, { color: isDark ? '#F2F2F7' : '#000' }]}>
            Period
          </Text>
          <View style={styles.periodContainer}>
            {(['monthly', 'yearly'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodOption,
                  period === p && styles.periodOptionActive,
                  {
                    backgroundColor: period === p ? '#007AFF' : isDark ? '#2C2C2E' : '#fff',
                  },
                ]}
                onPress={() => setPeriod(p)}
              >
                <Text
                  style={[
                    styles.periodOptionText,
                    { color: period === p ? '#fff' : isDark ? '#F2F2F7' : '#000' },
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Create Budget"
            onPress={handleAddBudget}
            loading={loading}
            size="large"
          />
        </View>
      )}

      {/* Budgets List */}
      <View style={styles.section}>
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const spent = BudgetUtils.getSpentAmount(budget, currentMonthTransactions);
            const percentage = BudgetUtils.getBudgetPercentage(budget, currentMonthTransactions);
            const isExceeded = percentage > 100;
            const remaining = BudgetUtils.getRemainingBudget(budget, currentMonthTransactions);

            return (
              <View
                key={budget.id}
                style={[
                  styles.budgetCard,
                  { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
                ]}
              >
                <View style={styles.budgetHeader}>
                  <Text style={[styles.budgetCategory, { color: isDark ? '#F2F2F7' : '#000' }]}>
                    {budget.category.toUpperCase()}
                  </Text>
                  <TouchableOpacity onPress={() => handleDeleteBudget(budget.id)}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color="#FF3B30"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.budgetInfo}>
                  <View>
                    <Text style={[styles.budgetSpent, { color: isDark ? '#A1A1A6' : '#666' }]}>
                      Spent
                    </Text>
                    <Text style={[styles.budgetAmount, { color: isExceeded ? '#FF3B30' : '#34C759' }]}>
                      {CurrencyUtils.formatCurrency(spent, currency)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.budgetSpent, { color: isDark ? '#A1A1A6' : '#666' }]}>
                      Limit
                    </Text>
                    <Text style={[styles.budgetAmount, { color: isDark ? '#F2F2F7' : '#000' }]}>
                      {CurrencyUtils.formatCurrency(budget.limit, currency)}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isExceeded ? '#FF3B30' : '#34C759',
                      },
                    ]}
                  />
                </View>

                <View style={styles.budgetFooter}>
                  <Text style={[styles.budgetPercentage, { color: isDark ? '#A1A1A6' : '#666' }]}>
                    {percentage.toFixed(0)}% used
                  </Text>
                  <Text style={[styles.budgetRemaining, { color: isExceeded ? '#FF3B30' : '#34C759' }]}>
                    {remaining > 0 ? `${CurrencyUtils.formatCurrency(remaining, currency)} left` : 'Exceeded'}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="target-outline"
              size={48}
              color={isDark ? '#A1A1A6' : '#999'}
            />
            <Text style={[styles.emptyText, { color: isDark ? '#A1A1A6' : '#666' }]}>
              No budgets created yet
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#666' : '#999' }]}>
              Create a budget to track your spending
            </Text>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryOptionActive: {},
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  periodOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  periodOptionActive: {},
  periodOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  budgetCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetSpent: {
    fontSize: 12,
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetPercentage: {
    fontSize: 12,
  },
  budgetRemaining: {
    fontSize: 12,
    fontWeight: '600',
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
