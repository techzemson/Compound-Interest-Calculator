export interface CalculatorInputs {
  initialDeposit: number;
  contribution: number;
  contributionFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'yearly';
  annualStepUp: number; // New: Annual % increase in contribution
  interestRate: number;
  years: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'yearly';
  inflationRate: number;
  taxRate: number;
  taxTiming: 'yearly' | 'end'; // New: When tax is applied
  currency: string;
  targetAmount: number; // New: Financial Goal
}

export interface YearlyData {
  year: number;
  principal: number;
  contributions: number;
  interest: number;
  totalBalance: number;
  inflationAdjusted: number;
  optimisticBalance?: number; // New: Variance +2%
  pessimisticBalance?: number; // New: Variance -2%
}

export interface CalculationResult {
  totalDeposits: number;
  totalInterest: number;
  totalTax: number;
  finalBalance: number;
  finalBalanceAdjusted: number;
  yearlyBreakdown: YearlyData[];
  goalReachedYear: number | null; // New
  doublingTime: number; // New: Rule of 72
  multiplier: number; // New: X times money
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputs: CalculatorInputs;
  finalBalance: number;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
];