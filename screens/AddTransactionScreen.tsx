import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/context/appStore';
import { Button } from '@/components/common/Button';
import { Transaction, TransactionType, TransactionCategory } from '@/types';

const CATEGORIES: TransactionCategory[] = [
  'salary',
  'bonus',
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

const categoryIcons: Record<TransactionCategory, string> = {
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

export const AddTransactionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { addTransaction, user } = useAppStore();

  const handleAddTransaction = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount');
        return;
      }

      if (!description.trim()) {
        Alert.alert('Missing Description', 'Please enter a description');
        return;
      }

      setLoading(true);

      const transaction: Transaction = {
        id: `transaction_${Date.now()}`,
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString(),
        currency: user?.currency || 'USD',
      };

      await addTransaction(transaction);

      Alert.alert('Success', 'Transaction added successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={styles.contentContainer}
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
          Add Transaction
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Type Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Type
        </Text>
        <View style={styles.typeContainer}>
          {(['income', 'expense'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeButton,
                type === t && styles.typeButtonActive,
                {
                  backgroundColor: type === t ? (t === 'income' ? '#34C759' : '#FF3B30') : isDark ? '#1C1C1E' : '#F2F2F7',
                },
              ]}
              onPress={() => setType(t)}
            >
              <MaterialCommunityIcons
                name={t === 'income' ? 'plus-circle' : 'minus-circle'}
                size={24}
                color={type === t ? '#fff' : isDark ? '#F2F2F7' : '#000'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  { color: type === t ? '#fff' : isDark ? '#F2F2F7' : '#000' },
                ]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Amount
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
              color: isDark ? '#F2F2F7' : '#000',
              borderColor: isDark ? '#1C1C1E' : '#E5E5EA',
            },
          ]}
          placeholder="0.00"
          placeholderTextColor={isDark ? '#666' : '#999'}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Category
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive,
                {
                  backgroundColor: category === cat ? '#007AFF' : isDark ? '#1C1C1E' : '#F2F2F7',
                },
              ]}
              onPress={() => setCategory(cat)}
            >
              <MaterialCommunityIcons
                name={categoryIcons[cat]}
                size={24}
                color={category === cat ? '#fff' : isDark ? '#F2F2F7' : '#000'}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  { color: category === cat ? '#fff' : isDark ? '#F2F2F7' : '#000' },
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Description Input */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F2F2F7' : '#000' }]}>
          Description
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.descriptionInput,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
              color: isDark ? '#F2F2F7' : '#000',
              borderColor: isDark ? '#1C1C1E' : '#E5E5EA',
            },
          ]}
          placeholder="Add a note..."
          placeholderTextColor={isDark ? '#666' : '#999'}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Add Button */}
      <Button
        title="Add Transaction"
        onPress={handleAddTransaction}
        loading={loading}
        size="large"
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonActive: {},
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  descriptionInput: {
    textAlignVertical: 'top',
    height: 100,
    paddingTop: 12,
  },
  categoryScrollContent: {
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  categoryButtonActive: {},
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});
