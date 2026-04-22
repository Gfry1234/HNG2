import { Transaction, RecurringTransaction, Budget } from '@/types';
import { CurrencyUtils } from './currencyUtils';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const ExportUtils = {
  // Generate CSV content
  generateCSV(
    transactions: Transaction[],
    recurringTransactions?: RecurringTransaction[],
    budgets?: Budget[]
  ): string {
    let csv = 'Transaction Export\n\n';

    // Transactions section
    csv += 'TRANSACTIONS\n';
    csv += 'ID,Type,Amount,Category,Description,Date,Currency\n';

    transactions.forEach((t) => {
      csv += `"${t.id}","${t.type}","${t.amount}","${t.category}","${t.description}","${t.date}","${t.currency}"\n`;
    });

    csv += '\n';

    // Recurring transactions section
    if (recurringTransactions && recurringTransactions.length > 0) {
      csv += 'RECURRING TRANSACTIONS\n';
      csv += 'ID,Type,Amount,Category,Description,Frequency,Start Date,End Date,Currency\n';

      recurringTransactions.forEach((t) => {
        csv += `"${t.id}","${t.type}","${t.amount}","${t.category}","${t.description}","${t.frequency}","${t.startDate}","${t.endDate || 'N/A'}","${t.currency}"\n`;
      });

      csv += '\n';
    }

    // Budgets section
    if (budgets && budgets.length > 0) {
      csv += 'BUDGETS\n';
      csv += 'ID,Category,Limit,Period,Start Date,Currency\n';

      budgets.forEach((b) => {
        csv += `"${b.id}","${b.category}","${b.limit}","${b.period}","${b.startDate}","${b.currency}"\n`;
      });
    }

    return csv;
  },

  // Export to CSV file
  async exportToCSV(
    transactions: Transaction[],
    recurringTransactions?: RecurringTransaction[],
    budgets?: Budget[]
  ): Promise<void> {
    try {
      const csv = this.generateCSV(transactions, recurringTransactions, budgets);
      const filename = `expense_tracker_${new Date().getTime()}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, csv);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Expense Tracker Data',
        });
      }
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  },

  // Generate PDF content (simple text-based)
  generatePDFContent(
    transactions: Transaction[],
    summary: { totalIncome: number; totalExpenses: number; balance: number; currency: string }
  ): string {
    let content = 'EXPENSE TRACKER REPORT\n';
    content += '='.repeat(50) + '\n';
    content += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary section
    content += 'FINANCIAL SUMMARY\n';
    content += '-'.repeat(50) + '\n';
    content += `Total Income: ${CurrencyUtils.formatCurrency(summary.totalIncome, summary.currency)}\n`;
    content += `Total Expenses: ${CurrencyUtils.formatCurrency(summary.totalExpenses, summary.currency)}\n`;
    content += `Balance: ${CurrencyUtils.formatCurrency(summary.balance, summary.currency)}\n`;
    content += '\n';

    // Transactions section
    content += 'RECENT TRANSACTIONS\n';
    content += '-'.repeat(50) + '\n';

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sortedTransactions.slice(0, 50).forEach((t) => {
      const formatted = CurrencyUtils.formatCurrency(t.amount, t.currency);
      content += `${t.date} | ${t.category.toUpperCase()} | ${t.type.toUpperCase()} | ${formatted}\n`;
      content += `  ${t.description}\n`;
    });

    return content;
  },

  // Export to PDF file (using text-based approach)
  async exportToPDF(
    transactions: Transaction[],
    summary: { totalIncome: number; totalExpenses: number; balance: number; currency: string }
  ): Promise<void> {
    try {
      const content = this.generatePDFContent(transactions, summary);
      const filename = `expense_tracker_${new Date().getTime()}.txt`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, content);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Export Expense Tracker Report',
        });
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  },

  // Get export statistics
  getExportStats(transactions: Transaction[]): {
    totalTransactions: number;
    dateRange: string;
    averageTransaction: number;
  } {
    if (transactions.length === 0) {
      return {
        totalTransactions: 0,
        dateRange: 'No transactions',
        averageTransaction: 0,
      };
    }

    const dates = transactions.map((t) => new Date(t.date).getTime());
    const minDate = new Date(Math.min(...dates)).toLocaleDateString();
    const maxDate = new Date(Math.max(...dates)).toLocaleDateString();

    const totalAmount = transactions.reduce((sum, t) => {
      return sum + (t.type === 'expense' ? t.amount : 0);
    }, 0);

    return {
      totalTransactions: transactions.length,
      dateRange: `${minDate} to ${maxDate}`,
      averageTransaction: totalAmount / transactions.length,
    };
  },
};
