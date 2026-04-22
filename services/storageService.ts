import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, RecurringTransaction, Budget, User } from '@/types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'expense_tracker_transactions',
  RECURRING_TRANSACTIONS: 'expense_tracker_recurring_transactions',
  BUDGETS: 'expense_tracker_budgets',
  USER: 'expense_tracker_user',
  LIVENESS_VERIFIED: 'expense_tracker_liveness_verified',
};

export const StorageService = {
  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading transactions:', error);
      return [];
    }
  },

  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const existingIndex = transactions.findIndex((t) => t.id === transaction.id);
      if (existingIndex >= 0) {
        transactions[existingIndex] = transaction;
      } else {
        transactions.push(transaction);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const filtered = transactions.filter((t) => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  async saveMultipleTransactions(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving multiple transactions:', error);
      throw error;
    }
  },

  // Recurring Transactions
  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECURRING_TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading recurring transactions:', error);
      return [];
    }
  },

  async saveRecurringTransaction(transaction: RecurringTransaction): Promise<void> {
    try {
      const transactions = await this.getRecurringTransactions();
      const existingIndex = transactions.findIndex((t) => t.id === transaction.id);
      if (existingIndex >= 0) {
        transactions[existingIndex] = transaction;
      } else {
        transactions.push(transaction);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.RECURRING_TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving recurring transaction:', error);
      throw error;
    }
  },

  async deleteRecurringTransaction(id: string): Promise<void> {
    try {
      const transactions = await this.getRecurringTransactions();
      const filtered = transactions.filter((t) => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.RECURRING_TRANSACTIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
      throw error;
    }
  },

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading budgets:', error);
      return [];
    }
  },

  async saveBudget(budget: Budget): Promise<void> {
    try {
      const budgets = await this.getBudgets();
      const existingIndex = budgets.findIndex((b) => b.id === budget.id);
      if (existingIndex >= 0) {
        budgets[existingIndex] = budget;
      } else {
        budgets.push(budget);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budget:', error);
      throw error;
    }
  },

  async deleteBudget(id: string): Promise<void> {
    try {
      const budgets = await this.getBudgets();
      const filtered = budgets.filter((b) => b.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },

  // User
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user:', error);
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Liveness Verification
  async setLivenessVerified(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LIVENESS_VERIFIED,
        JSON.stringify({ userId, timestamp: new Date().toISOString() })
      );
    } catch (error) {
      console.error('Error setting liveness verified:', error);
      throw error;
    }
  },

  async isLivenessVerified(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LIVENESS_VERIFIED);
      if (!data) return false;

      const verifiedData = JSON.parse(data);
      const verifiedTime = new Date(verifiedData.timestamp).getTime();
      const currentTime = new Date().getTime();
      const oneHour = 60 * 60 * 1000; // Verification valid for 1 hour

      return currentTime - verifiedTime < oneHour;
    } catch (error) {
      console.error('Error checking liveness verified:', error);
      return false;
    }
  },

  async clearLivenessVerification(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LIVENESS_VERIFIED);
    } catch (error) {
      console.error('Error clearing liveness verification:', error);
      throw error;
    }
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  },
};
