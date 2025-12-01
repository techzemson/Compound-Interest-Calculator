import { CalculatorInputs, CalculationResult, YearlyData, CURRENCIES } from '../types';

export const calculateCompoundInterest = (inputs: CalculatorInputs): CalculationResult => {
  // Destructure with defaults to prevent NaN
  const {
    initialDeposit = 0,
    contribution = 0,
    contributionFrequency = 'monthly',
    annualStepUp = 0,
    interestRate = 0,
    years = 0,
    compoundingFrequency = 'monthly',
    inflationRate = 0,
    taxRate = 0,
    taxTiming = 'end',
    targetAmount = 0
  } = inputs;

  const r = (interestRate || 0) / 100;
  const inf = (inflationRate || 0) / 100;
  const tax = (taxRate || 0) / 100;
  const stepUp = (annualStepUp || 0) / 100;

  // Calculate Variance Rates
  const rOptimistic = ((interestRate || 0) + 2) / 100;
  const rPessimistic = Math.max(0, (interestRate || 0) - 2) / 100;
  
  // Frequency mapper
  const n = compoundingFrequency === 'monthly' ? 12 : compoundingFrequency === 'quarterly' ? 4 : 1;
  
  // Contribution frequency to months map
  let contributionPerPeriod = 0;
  let contributionIntervalMonths = 0;

  switch (contributionFrequency) {
    case 'weekly': contributionPerPeriod = contribution * 4.333; contributionIntervalMonths = 1; break; 
    case 'bi-weekly': contributionPerPeriod = contribution * 2.166; contributionIntervalMonths = 1; break;
    case 'monthly': contributionPerPeriod = contribution; contributionIntervalMonths = 1; break;
    case 'yearly': contributionPerPeriod = contribution; contributionIntervalMonths = 12; break;
    default: contributionPerPeriod = contribution; contributionIntervalMonths = 1; break;
  }

  // State variables for Main Scenario
  let currentBalance = initialDeposit;
  let totalContributed = initialDeposit;
  let totalInterestGross = 0;
  let totalTaxPaid = 0;
  
  // State for Variance
  let optBalance = initialDeposit;
  let pessBalance = initialDeposit;

  let currentMonthlyContribution = contributionFrequency === 'yearly' ? contribution : contributionPerPeriod;

  const yearlyData: YearlyData[] = [];
  const totalMonths = (years || 0) * 12;
  
  let goalReachedYear: number | null = null;
  if (initialDeposit >= targetAmount && targetAmount > 0) goalReachedYear = 0;

  // Prevent infinite loop if years is somehow negative or invalid
  if (totalMonths > 0 && totalMonths <= 1200) { // Limit to 100 years max to prevent browser hang
    for (let m = 1; m <= totalMonths; m++) {
      const isYearStart = (m - 1) % 12 === 0 && m > 1;

      // Apply Annual Step Up
      if (isYearStart && stepUp > 0) {
        currentMonthlyContribution *= (1 + stepUp);
      }

      // Apply Contribution
      let contributionAmount = 0;
      if (contributionFrequency === 'yearly') {
         if (m % 12 === 0) contributionAmount = currentMonthlyContribution;
      } else {
         contributionAmount = currentMonthlyContribution; 
      }

      currentBalance += contributionAmount;
      optBalance += contributionAmount;
      pessBalance += contributionAmount;
      totalContributed += contributionAmount;

      // Calculate Interest (Standard)
      const isCompoundingMonth = (compoundingFrequency === 'monthly') ||
                                 (compoundingFrequency === 'quarterly' && m % 3 === 0) ||
                                 (compoundingFrequency === 'yearly' && m % 12 === 0);

      if (isCompoundingMonth) {
        const periodRate = r / n;
        const interestForPeriod = currentBalance * periodRate;
        
        // Variance Interest
        const optInterest = optBalance * (rOptimistic / n);
        const pessInterest = pessBalance * (rPessimistic / n);

        let netInterest = interestForPeriod;
        
        // Tax Logic
        if (taxTiming === 'yearly') {
          const taxAmount = interestForPeriod * tax;
          netInterest = interestForPeriod - taxAmount;
          totalTaxPaid += taxAmount;
        }

        currentBalance += netInterest;
        totalInterestGross += interestForPeriod;

        optBalance += optInterest;
        pessBalance += pessInterest;
      }

      // Check Goal
      if (goalReachedYear === null && targetAmount > 0 && currentBalance >= targetAmount) {
        goalReachedYear = Math.ceil(m / 12);
      }

      // Record Yearly Data
      if (m % 12 === 0) {
        const currentYear = m / 12;
        const adjustedValue = currentBalance / Math.pow(1 + inf, currentYear);

        yearlyData.push({
          year: currentYear,
          principal: initialDeposit,
          contributions: totalContributed - initialDeposit,
          interest: currentBalance - totalContributed, 
          totalBalance: currentBalance,
          inflationAdjusted: adjustedValue,
          optimisticBalance: optBalance,
          pessimisticBalance: pessBalance
        });
      }
    }
  }

  // End of Term Tax Calculation
  if (taxTiming === 'end') {
    const taxableAmount = currentBalance - totalContributed;
    if (taxableAmount > 0) {
      const taxAmount = taxableAmount * tax;
      currentBalance -= taxAmount;
      totalTaxPaid = taxAmount;
    }
  }

  const finalBalanceAdjusted = currentBalance / Math.pow(1 + inf, years);

  // Rule of 72
  const effectiveRate = interestRate; 
  const doublingTime = effectiveRate > 0 ? 72 / effectiveRate : 0;

  // Multiplier
  const multiplier = totalContributed > 0 ? currentBalance / totalContributed : 0;

  return {
    totalDeposits: totalContributed || 0,
    totalInterest: (currentBalance - totalContributed) || 0,
    totalTax: totalTaxPaid || 0,
    finalBalance: currentBalance || 0,
    finalBalanceAdjusted: finalBalanceAdjusted || 0,
    yearlyBreakdown: yearlyData,
    goalReachedYear,
    doublingTime: doublingTime || 0,
    multiplier: multiplier || 0
  };
};

export const formatCurrency = (amount: number, currencyCode: string) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '-';
  
  // Safe access to CURRENCIES
  const safeCurrencies = Array.isArray(CURRENCIES) ? CURRENCIES : [];
  const currencyData = safeCurrencies.find((c: any) => c.code === currencyCode);
  const locale = currencyData ? currencyData.locale : 'en-US';
  const code = currencyData ? currencyData.code : (currencyCode || 'USD');
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    return `${amount.toFixed(0)}`;
  }
};