import { CalculatorInputs, CalculationResult, YearlyData, CURRENCIES } from '../types';

export const calculateCompoundInterest = (inputs: CalculatorInputs): CalculationResult => {
  const {
    initialDeposit,
    contribution,
    contributionFrequency,
    annualStepUp,
    interestRate,
    years,
    compoundingFrequency,
    inflationRate,
    taxRate,
    taxTiming,
    targetAmount
  } = inputs;

  const r = interestRate / 100;
  const inf = inflationRate / 100;
  const tax = taxRate / 100;
  const stepUp = annualStepUp / 100;

  // Calculate Variance Rates
  const rOptimistic = (interestRate + 2) / 100;
  const rPessimistic = Math.max(0, interestRate - 2) / 100;
  
  // Frequency mapper
  const n = compoundingFrequency === 'monthly' ? 12 : compoundingFrequency === 'quarterly' ? 4 : 1;
  
  // Contribution frequency to months map
  // We will normalize the simulation to monthly steps
  let contributionPerPeriod = 0;
  let contributionIntervalMonths = 0;

  switch (contributionFrequency) {
    case 'weekly': contributionPerPeriod = contribution * 4.333; contributionIntervalMonths = 1; break; // Simplified to monthly avg
    case 'bi-weekly': contributionPerPeriod = contribution * 2.166; contributionIntervalMonths = 1; break;
    case 'monthly': contributionPerPeriod = contribution; contributionIntervalMonths = 1; break;
    case 'yearly': contributionPerPeriod = contribution; contributionIntervalMonths = 12; break;
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
  const totalMonths = years * 12;
  
  let goalReachedYear: number | null = null;
  if (initialDeposit >= targetAmount) goalReachedYear = 0;

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
       // Monthly, Weekly, Bi-weekly are averaged to monthly for smoother graphing in this engine
       // or applied monthly
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

      optBalance += optInterest; // Variance usually ignores tax for simple comparison
      pessBalance += pessInterest;
    }

    // Check Goal
    if (goalReachedYear === null && currentBalance >= targetAmount) {
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
    totalDeposits: totalContributed,
    totalInterest: currentBalance - totalContributed,
    totalTax: totalTaxPaid,
    finalBalance: currentBalance,
    finalBalanceAdjusted,
    yearlyBreakdown: yearlyData,
    goalReachedYear,
    doublingTime,
    multiplier
  };
};

export const formatCurrency = (amount: number, currencyCode: string) => {
  const currencyData = CURRENCIES.find((c: any) => c.code === currencyCode);
  const locale = currencyData ? currencyData.locale : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};