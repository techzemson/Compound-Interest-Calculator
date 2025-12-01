import { CalculatorInputs, CalculationResult, YearlyData } from '../types';

export const calculateCompoundInterest = (inputs: CalculatorInputs): CalculationResult => {
  const {
    initialDeposit,
    contribution,
    contributionFrequency,
    interestRate,
    years,
    compoundingFrequency,
    inflationRate,
    taxRate,
  } = inputs;

  const r = interestRate / 100;
  const inf = inflationRate / 100;
  const tax = taxRate / 100;
  
  // Frequency mapper
  const n = compoundingFrequency === 'monthly' ? 12 : compoundingFrequency === 'quarterly' ? 4 : 1;
  const contributionMultiplier = contributionFrequency === 'monthly' ? 12 : 1;
  
  let currentBalance = initialDeposit;
  let totalContributed = initialDeposit;
  let totalInterestAccrued = 0;
  let totalTaxPaid = 0;

  const yearlyData: YearlyData[] = [];

  // Monthly iteration for precision
  const totalMonths = years * 12;
  
  for (let m = 1; m <= totalMonths; m++) {
    // Apply contribution
    if (contributionFrequency === 'monthly') {
      currentBalance += contribution;
      totalContributed += contribution;
    } else if (contributionFrequency === 'yearly' && m % 12 === 0) {
      currentBalance += contribution;
      totalContributed += contribution;
    }

    // Apply Interest
    // Rate per period based on compounding frequency
    // Simplified: We calculate monthly growth effectively but compound based on frequency
    // For standard formula compatibility: A = P(1 + r/n)^(nt)
    // Here we iterate to capture the exact flow for charts
    
    // Determine if interest is applied this month
    const isCompoundingMonth = (compoundingFrequency === 'monthly') ||
                               (compoundingFrequency === 'quarterly' && m % 3 === 0) ||
                               (compoundingFrequency === 'yearly' && m % 12 === 0);

    if (isCompoundingMonth) {
      const periodRate = r / n;
      const interestForPeriod = currentBalance * periodRate;
      
      // Apply Tax on Interest if applicable
      const taxOnInterest = interestForPeriod * tax;
      const netInterest = interestForPeriod - taxOnInterest;

      totalTaxPaid += taxOnInterest;
      totalInterestAccrued += interestForPeriod; // Gross interest
      currentBalance += netInterest;
    }

    // Record Yearly Data
    if (m % 12 === 0) {
      const currentYear = m / 12;
      // Calculate Inflation Adjusted Value: PV = FV / (1+i)^n
      const adjustedValue = currentBalance / Math.pow(1 + inf, currentYear);

      yearlyData.push({
        year: currentYear,
        principal: initialDeposit,
        contributions: totalContributed - initialDeposit,
        interest: currentBalance - totalContributed, // Net growth
        totalBalance: currentBalance,
        inflationAdjusted: adjustedValue,
      });
    }
  }

  const finalBalanceAdjusted = currentBalance / Math.pow(1 + inf, years);

  return {
    totalDeposits: totalContributed,
    totalInterest: currentBalance - totalContributed, // Net profit
    totalTax: totalTaxPaid,
    finalBalance: currentBalance,
    finalBalanceAdjusted,
    yearlyBreakdown: yearlyData,
  };
};

export const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
