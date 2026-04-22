import { create } from 'zustand';
import { Transaction, RecurringTransaction, Budget, User, FinancialSummary } from '@/types';
import { StorageService } from '@/services/storageService';
import { TransactionUtils, RecurringUtils, BudgetUtils } from '@/utils/transactionUtils';

interface AppStore {
  // Data
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  budgets: Budget[];
  user: User | null;
  livenessVerified: boolean;

  // Financial Summary
  summary: FinancialSummary | null;

  // UI State
  loading: boolean;
  error: string | null;

  // Actions - Transactions
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Actions - Recurring Transactions
  loadRecurringTransactions: () => Promise<void>;
  addRecurringTransaction: (transaction: RecurringTransaction) => Promise<void>;
  updateRecurringTransaction: (transaction: RecurringTransaction) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
  processRecurringTransactions: () => Promise<void>;

  // Actions - Budgets
  loadBudgets: () => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  // Actions - User
  loadUser: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setLivenessVerified: (verified: boolean) => Promise<void>;

  // Actions - Summary
  updateSummary: () => void;

  // Actions - General
  initialize: () => Promise<void>;
  clearAllData: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  transactions: [],
  recurringTransactions: [],
  budgets: [],
  user: null,
  livenessVerified: false,
  summary: null,
  loading: false,
  error: null,

  // Transactions
  loadTransactions: async () => {
    try {
      set({ loading: true });
      const transactions = await StorageService.getTransactions();
      set({ transactions });
      get().updateSummary();
    } catch (error: any) {
      set({ error: error?.message || 'Failed to load transactions' });
    } finally {
      set({ loading: false });
    }
  },

  addTransaction: async (transaction: Transaction) => {
    try {
      await StorageService.saveTransaction(transaction);
      set((state) => ({
        transactions: [...state.transactions, transaction],
      }));
      get().updateSummary();
    } catch (error: any) {
      set({ error: error?.message || 'Failed to add transaction' });
      throw error;
    }
  },

  updateTransaction: async (transaction: Transaction) => {
    try {
      await StorageService.saveTransaction(transaction);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === transaction.id ? transaction : t
        ),
      }));
      get().updateSummary();
    } catch (error: any) {
      set({ error: error?.message || 'Failed to update transaction' });
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await StorageService.deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
      get().updateSummary();
    } catch (error: any) {
      set({ error: error?.message || 'Failed to delete transaction' });
      throw error;
    }
  },

  // Recurring Transactions
  loadRecurringTransactions: async () => {
    try {
      set({ loading: true });
      const recurringTransactions = await StorageService.getRecurringTransactions();
      set({ recurringTransactions });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to load recurring transactions' });
    } finally {
      set({ loading: false });
    }
  },

  addRecurringTransaction: async (transaction: RecurringTransaction) => {
    try {
      await StorageService.saveRecurringTransaction(transaction);
      set((state) => ({
        recurringTransactions: [...state.recurringTransactions, transaction],
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Failed to add recurring transaction' });
      throw error;
    }
  },

  updateRecurringTransaction: async (transaction: RecurringTransaction) => {
    try {
      await StorageService.saveRecurringTransaction(transaction);
      set((state) => ({
        recurringTransactions: state.recurringTransactions.map((t) =>
          t.id === transaction.id ? transaction : t
        ),
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Failed to update recurring transaction' });
      throw error;
    }
  },

  deleteRecurringTransaction: async (id: string) => {
    try {
      await StorageService.deleteRecurringTransaction(id);
      set((state) => ({
        recurringTransactions: state.recurringTransactions.filter((t) => t.id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Failed to delete recurring transaction' });
      throw error;
    }
  },

  processRecurringTransactions: async () => {
    try {
      const { recurringTransactions, transactions } = get();
      const dueTransactions = RecurringUtils.getDueTransactions(recurringTransactions);

      if (dueTransactions.length === 0) return;

      const newTransactions: Transaction[] = [];
      const updatedRecurring: RecurringTransaction[] = [];

      for (const recurring of dueTransactions) {
        // Generate new transaction
        const newTransaction = RecurringUtils.generateTransaction(recurring);
        newTransactions.push(newTransaction);

        // Update recurring transaction
        const updated = {
          ...recurring,
          nextDueDate: RecurringUtils.getNextOccurrence(recurring).toISOString(),
        };
        updatedRecurring.push(updated);
      }

      // Save all changes
      if (newTransactions.length > 0) {
        await StorageService.saveMultipleTransactions([...transactions, ...newTransactions]);
        set({ transactions: [...transactions, ...newTransactions] });
      }

      for (const recurring of updatedRecurring) {
        await StorageService.saveRecurringTransaction(recurring);
      }

      set((state) => ({
        recurringTransactions: state.recurringTransactions.map(
          (t) =>
            updatedRecurring.find((u) => u.id === t.id) || t
        ),
      }));

      get().updateSummary();
    } catch (error: any) {
      console.error('Error processing recurring transactions:', error);
    }
  },

  // Budgets
  loadBudgets: async () => {
    try {
      set({ loading: true });
      const budgets = await StorageService.getBudgets();
      set({ budgets });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to load budgets' });
    } finally {
      set({ loading: false });
    }
  },

  addBudget: async (budget: Budget) => {
    try {
      await StorageService.saveBudget(budget);
      set((state) => ({
        budgets: [...state.budgets, budget],
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Failed to add budget' });
      throw error;
    }
  },

  updateBudget: async (budget: Budget) => {
    try {
      await StorageService.saveBudget(budget);
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === budget.id ? budget : b
        ),
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Failed to update budget' });
      throw error;
    }
  },

  deleteBudget: async (id: string) => {
    try {
      await StorageService.deleteBudget(id);
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.message || 'Failed to delete budget' });
      throw error;
    }
  },

  // User
  loadUser: async () => {
    try {
      const user = await StorageService.getUser();
      set({ user });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to load user' });
    }
  },

  setUser: async (user: User) => {
    try {
      await StorageService.saveUser(user);
      set({ user });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to save user' });
      throw error;
    }
  },

  setLivenessVerified: async (verified: boolean) => {
    try {
      if (verified && get().user?.id) {
        await StorageService.setLivenessVerified(get().user!.id);
      } else {
        await StorageService.clearLivenessVerification();
      }
      set({ livenessVerified: verified });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to update liveness verification' });
      throw error;
    }
  },

  // Summary
  updateSummary: () => {
    const state = get();
    const currency = state.user?.currency || 'USD';
    const summary = TransactionUtils.calculateSummary(state.transactions, currency);
    set({ summary });
  },

  // General
  initialize: async () => {
    try {
      set({ loading: true });
      await get().loadUser();
      await get().loadTransactions();
      await get().loadRecurringTransactions();
      await get().loadBudgets();
      await get().processRecurringTransactions();

      // Check liveness verification
      const isVerified = await StorageService.isLivenessVerified();
      set({ livenessVerified: isVerified });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to initialize app' });
    } finally {
      set({ loading: false });
    }
  },

  clearAllData: async () => {
    try {
      set({ loading: true });
      await StorageService.clearAllData();
      set({
        transactions: [],
        recurringTransactions: [],
        budgets: [],
        user: null,
        livenessVerified: false,
        summary: null,
      });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to clear data' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
