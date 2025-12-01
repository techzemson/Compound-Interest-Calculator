export interface CalculatorInputs {
  initialDeposit: number;
  contribution: number;
  contributionFrequency: 'monthly' | 'yearly';
  interestRate: number;
  years: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'yearly';
  inflationRate: number;
  taxRate: number;
  currency: string;
}

export interface YearlyData {
  year: number;
  principal: number;
  contributions: number;
  interest: number;
  totalBalance: number;
  inflationAdjusted: number;
}

export interface CalculationResult {
  totalDeposits: number;
  totalInterest: number;
  totalTax: number;
  finalBalance: number;
  finalBalanceAdjusted: number;
  yearlyBreakdown: YearlyData[];
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];
