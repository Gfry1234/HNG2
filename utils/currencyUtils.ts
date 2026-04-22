import { CurrencyFormatOptions } from '@/types';

const CURRENCY_SYMBOLS: Record<string, CurrencyFormatOptions> = {
  USD: {
    symbol: '$',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
  },
  EUR: {
    symbol: '€',
    position: 'suffix',
    decimals: 2,
    thousandsSeparator: '.',
  },
  GBP: {
    symbol: '£',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
  },
  JPY: {
    symbol: '¥',
    position: 'prefix',
    decimals: 0,
    thousandsSeparator: ',',
  },
  INR: {
    symbol: '₹',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
  },
  NGN: {
    symbol: '₦',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
  },
  AUD: {
    symbol: '$',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
  },
  CAD: {
    symbol: '$',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
  },
};

export const CurrencyUtils = {
  formatCurrency(amount: number, currencyCode: string = 'USD'): string {
    const format = CURRENCY_SYMBOLS[currencyCode] || CURRENCY_SYMBOLS.USD;

    // Round to specified decimals
    const roundedAmount = parseFloat(amount.toFixed(format.decimals));

    // Format the number with thousands separator
    const parts = roundedAmount.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandsSeparator);
    const formattedAmount = parts.join('.');

    // Position the currency symbol
    if (format.position === 'prefix') {
      return `${format.symbol}${formattedAmount}`;
    } else {
      return `${formattedAmount} ${format.symbol}`;
    }
  },

  getSymbol(currencyCode: string = 'USD'): string {
    return CURRENCY_SYMBOLS[currencyCode]?.symbol || '$';
  },

  parseAmount(formattedAmount: string): number {
    // Remove currency symbol and whitespace
    const cleaned = formattedAmount.replace(/[^\d.,\-]/g, '');
    // Replace thousands separator with empty and decimal separator with dot
    const normalized = cleaned.replace(/[.,]/g, (match) => (match === ',' ? '' : '.'));
    return parseFloat(normalized) || 0;
  },

  getSupportedCurrencies(): string[] {
    return Object.keys(CURRENCY_SYMBOLS);
  },

  addCurrency(code: string, options: CurrencyFormatOptions): void {
    CURRENCY_SYMBOLS[code] = options;
  },
};
