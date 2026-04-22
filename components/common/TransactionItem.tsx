import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CurrencyUtils } from '@/utils/currencyUtils';
import { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

const categoryIcons: Record<string, string> = {
  salary: 'wallet',
  bonus: 'gift',
  food: 'silverware-fork-knife',
  transport: 'car',
  entertainment: 'movie',
  utilities: 'home',
  shopping: 'shopping',
  healthcare: 'hospital-box',
  education: 'school',
  rent: 'home-city',
  other: 'tag',
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const categoryColor = transaction.type === 'income' ? '#34C759' : '#FF3B30';
  const icon = categoryIcons[transaction.category] || 'tag';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={categoryColor} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.category, { color: isDark ? '#F2F2F7' : '#000' }]}>
          {transaction.category.toUpperCase()}
        </Text>
        <Text style={[styles.description, { color: isDark ? '#A1A1A6' : '#666' }]}>
          {transaction.description}
        </Text>
      </View>

      <View style={styles.rightContent}>
        <Text
          style={[
            styles.amount,
            { color: transaction.type === 'income' ? '#34C759' : '#FF3B30' },
          ]}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {CurrencyUtils.formatCurrency(transaction.amount, transaction.currency)}
        </Text>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <MaterialCommunityIcons name="close" size={18} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
});
