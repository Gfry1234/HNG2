import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useAppStore } from '@/context/appStore';
import { CurrencyUtils } from '@/utils/currencyUtils';
import { DateUtils } from '@/utils/transactionUtils';
import { Button } from '@/components/common/Button';

const categoryIcons: Record<string, string> = {
  salary: 'wallet',
  bonus: 'gift',
  food: 'fork-knife',
  transport: 'car',
  entertainment: 'movie',
  utilities: 'home',
  shopping: 'cart',
  healthcare: 'hospital-box',
  education: 'school',
  rent: 'home-city',
  other: 'tag',
};

export default function TransactionDetail() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams();
  const navigation = useLocalSearchParams() as any;

  const { transactions, deleteTransaction } = useAppStore();

  const transaction = useMemo(() => {
    return transactions.find((t) => t.id === id);
  }, [transactions, id]);

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteTransaction(transaction!.id);
            // navigation.goBack();
          } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to delete transaction');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000', textAlign: 'center', marginTop: 40 }}>
          Transaction not found
        </Text>
      </View>
    );
  }

  const categoryColor = transaction.type === 'income' ? '#34C759' : '#FF3B30';
  const icon = categoryIcons[transaction.category] || 'tag';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: categoryColor + '20' },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={64} color={categoryColor} />
      </View>

      {/* Amount */}
      <Text style={[styles.amount, { color: categoryColor }]}>
        {transaction.type === 'income' ? '+' : '-'}
        {CurrencyUtils.formatCurrency(transaction.amount, transaction.currency)}
      </Text>

      {/* Category */}
      <Text style={[styles.category, { color: isDark ? '#F2F2F7' : '#000' }]}>
        {transaction.category.toUpperCase()}
      </Text>

      {/* Details Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
        ]}
      >
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDark ? '#A1A1A6' : '#666' }]}>
            Description
          </Text>
          <Text style={[styles.detailValue, { color: isDark ? '#F2F2F7' : '#000' }]}>
            {transaction.description}
          </Text>
        </View>

        <View style={[styles.detailDivider, { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDark ? '#A1A1A6' : '#666' }]}>
            Date
          </Text>
          <Text style={[styles.detailValue, { color: isDark ? '#F2F2F7' : '#000' }]}>
            {DateUtils.formatDate(transaction.date)}
          </Text>
        </View>

        <View style={[styles.detailDivider, { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDark ? '#A1A1A6' : '#666' }]}>
            Type
          </Text>
          <Text
            style={[
              styles.detailValue,
              {
                color: transaction.type === 'income' ? '#34C759' : '#FF3B30',
                textTransform: 'capitalize',
              },
            ]}
          >
            {transaction.type}
          </Text>
        </View>

        <View style={[styles.detailDivider, { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: isDark ? '#A1A1A6' : '#666' }]}>
            Currency
          </Text>
          <Text style={[styles.detailValue, { color: isDark ? '#F2F2F7' : '#000' }]}>
            {transaction.currency}
          </Text>
        </View>
      </View>

      {/* Delete Button */}
      <Button
        title="Delete Transaction"
        onPress={handleDelete}
        size="large"
        variant="danger"
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailDivider: {
    borderBottomWidth: 1,
  },
});
