export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'salary'
  | 'bonus'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'shopping'
  | 'healthcare'
  | 'education'
  | 'rent'
  | 'other';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string; // ISO string
  currency: string; // e.g., 'USD', 'EUR', 'GBP'
  isRecurring?: boolean;
  recurringId?: string;
}

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  currency: string;
  frequency: RecurrenceFrequency;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  nextDueDate: string; // ISO string
  createdAt: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  currency: string;
  period: 'monthly' | 'yearly';
  startDate: string; // ISO string
  createdAt: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currency: string;
}

export interface CategorySummary {
  category: TransactionCategory;
  total: number;
  percentage: number;
  count: number;
}

export interface CurrencyFormatOptions {
  symbol: string;
  position: 'prefix' | 'suffix';
  decimals: number;
  thousandsSeparator: string;
}

export interface LivenessCheckResult {
  success: boolean;
  userId?: string;
  timestamp: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  lastVerified?: string;
  theme: 'light' | 'dark' | 'auto';
  currency: string;
}
