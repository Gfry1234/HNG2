import { Transaction, RecurringTransaction, Budget, CategorySummary, FinancialSummary } from '@/types';

export const TransactionUtils = {
  // Calculate financial summary
  calculateSummary(transactions: Transaction[], currency: string): FinancialSummary {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      currency,
    };
  },

  // Calculate category breakdown
  calculateCategorySummary(
    transactions: Transaction[],
    type: 'income' | 'expense'
  ): CategorySummary[] {
    const filtered = transactions.filter((t) => t.type === type);
    const categoryMap = new Map<string, { total: number; count: number }>();

    filtered.forEach((t) => {
      const existing = categoryMap.get(t.category) || { total: 0, count: 0 };
      categoryMap.set(t.category, {
        total: existing.total + t.amount,
        count: existing.count + 1,
      });
    });

    const total = Array.from(categoryMap.values()).reduce((sum, v) => sum + v.total, 0);

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category: category as any,
      total: data.total,
      percentage: total > 0 ? (data.total / total) * 100 : 0,
      count: data.count,
    }));
  },

  // Get transactions for a date range
  getTransactionsByDateRange(transactions: Transaction[], startDate: Date, endDate: Date): Transaction[] {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });
  },

  // Get transactions by category
  getTransactionsByCategory(transactions: Transaction[], category: string): Transaction[] {
    return transactions.filter((t) => t.category === category);
  },

  // Check if transaction is recurring
  isRecurring(transaction: Transaction): boolean {
    return transaction.isRecurring === true;
  },

  // Sort transactions by date (newest first)
  sortByDate(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Get transactions for current month
  getCurrentMonthTransactions(transactions: Transaction[]): Transaction[] {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return this.getTransactionsByDateRange(transactions, firstDay, lastDay);
  },

  // Get transactions for current year
  getCurrentYearTransactions(transactions: Transaction[]): Transaction[] {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const lastDay = new Date(now.getFullYear(), 11, 31);
    return this.getTransactionsByDateRange(transactions, firstDay, lastDay);
  },
};

export const BudgetUtils = {
  // Check if budget is exceeded
  isBudgetExceeded(budget: Budget, transactions: Transaction[]): boolean {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return spent > budget.limit;
  },

  // Get budget percentage used
  getBudgetPercentage(budget: Budget, transactions: Transaction[]): number {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return (spent / budget.limit) * 100;
  },

  // Get amount spent in budget category
  getSpentAmount(budget: Budget, transactions: Transaction[]): number {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  // Get remaining budget
  getRemainingBudget(budget: Budget, transactions: Transaction[]): number {
    const spent = this.getSpentAmount(budget, transactions);
    return Math.max(0, budget.limit - spent);
  },

  // Get all budgets for current period
  getActiveBudgets(budgets: Budget[]): Budget[] {
    const now = new Date();
    return budgets.filter((b) => new Date(b.startDate) <= now);
  },
};

export const RecurringUtils = {
  // Generate next occurrence date
  getNextOccurrence(transaction: RecurringTransaction, referenceDate?: Date): Date {
    const ref = referenceDate || new Date();
    const date = new Date(ref);

    switch (transaction.frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }

    return date;
  },

  // Check if recurring transaction is due
  isDue(transaction: RecurringTransaction): boolean {
    const now = new Date();
    const dueDate = new Date(transaction.nextDueDate);

    if (transaction.endDate) {
      const endDate = new Date(transaction.endDate);
      if (now > endDate) return false;
    }

    return dueDate <= now;
  },

  // Get all due recurring transactions
  getDueTransactions(
    recurringTransactions: RecurringTransaction[]
  ): RecurringTransaction[] {
    return recurringTransactions.filter((t) => this.isDue(t));
  },

  // Generate transaction from recurring template
  generateTransaction(recurring: RecurringTransaction): Transaction {
    return {
      id: `${recurring.id}-${Date.now()}`,
      type: recurring.type,
      amount: recurring.amount,
      category: recurring.category,
      description: recurring.description,
      date: new Date().toISOString(),
      currency: recurring.currency,
      isRecurring: true,
      recurringId: recurring.id,
    };
  },
};

export const DateUtils = {
  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Get date range name
  getDateRangeName(startDate: Date, endDate: Date): string {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    if (startDate.getTime() === firstDayOfMonth.getTime() &&
        endDate.getMonth() === now.getMonth() &&
        endDate.getFullYear() === now.getFullYear()) {
      return 'This Month';
    }

    if (startDate.getTime() === firstDayOfYear.getTime() &&
        endDate.getFullYear() === now.getFullYear()) {
      return 'This Year';
    }

    return `${this.formatDate(startDate.toISOString())} - ${this.formatDate(endDate.toISOString())}`;
  },

  // Get relative date string (e.g., "2 days ago")
  getRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return this.formatDate(dateString);
  },
};
