import React, { useState } from 'react';
import { CalculatorInputs, CURRENCIES } from '../types';
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  BanknotesIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

interface Props {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  onCalculate: () => void;
  isCalculating: boolean;
}

const InputSection: React.FC<Props> = ({ inputs, setInputs, onCalculate, isCalculating }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (type: 'millionaire' | 'retire' | 'saver') => {
    switch(type) {
      case 'millionaire':
        setInputs(prev => ({ ...prev, initialDeposit: 10000, contribution: 2000, years: 20, interestRate: 8, annualStepUp: 5, targetAmount: 1000000 }));
        break;
      case 'retire':
        setInputs(prev => ({ ...prev, initialDeposit: 50000, contribution: 1500, years: 30, interestRate: 6, annualStepUp: 2, targetAmount: 2000000 }));
        break;
      case 'saver':
        setInputs(prev => ({ ...prev, initialDeposit: 5000, contribution: 500, years: 10, interestRate: 4, annualStepUp: 0 }));
        break;
    }
  };

  const handleReset = () => {
    setInputs({
      initialDeposit: 0,
      contribution: 0,
      contributionFrequency: 'monthly',
      annualStepUp: 0,
      interestRate: 5,
      years: 10,
      compoundingFrequency: 'monthly',
      inflationRate: 2,
      taxRate: 0,
      taxTiming: 'end',
      currency: 'USD',
      targetAmount: 0
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-none p-6 md:p-8 border border-slate-100 dark:border-slate-700 transition-colors">
      
      {/* Presets */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Start Presets</h3>
        <div className="grid grid-cols-3 gap-2">
           <button onClick={() => applyPreset('millionaire')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
             <RocketLaunchIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
             <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-700">Millionaire</span>
           </button>
           <button onClick={() => applyPreset('retire')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
             <BriefcaseIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 mb-1" />
             <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-emerald-700">Retire Early</span>
           </button>
           <button onClick={() => applyPreset('saver')} className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group">
             <AcademicCapIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-600 mb-1" />
             <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-purple-700">Safe Saver</span>
           </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-600" />
          Configuration
        </div>
        <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1">
          <ArrowPathIcon className="w-3 h-3" /> Reset
        </button>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Currency</label>
          <div className="relative">
            <select
              value={inputs.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 appearance-none cursor-pointer font-medium transition-colors"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name} ({c.symbol})</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Initial Deposit */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Initial Deposit</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BanknotesIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              value={inputs.initialDeposit}
              onChange={(e) => handleChange('initialDeposit', Number(e.target.value))}
              className="pl-10 block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Interest Rate (%)</label>
            <div className="group relative">
                <InformationCircleIcon className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 w-48 bg-slate-800 text-white text-xs rounded p-2 z-10">
                   Typical S&P 500 annual return is ~10% (historically). Savings accounts are 0.5-5%.
                </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ChartBarIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              step="0.1"
              value={inputs.interestRate}
              onChange={(e) => handleChange('interestRate', Number(e.target.value))}
              className="pl-10 block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              placeholder="5"
            />
          </div>
        </div>

        {/* Regular Contribution */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Regular Contribution</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                value={inputs.contribution}
                onChange={(e) => handleChange('contribution', Number(e.target.value))}
                className="pl-10 block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              />
            </div>
            <select
              value={inputs.contributionFrequency}
              onChange={(e) => handleChange('contributionFrequency', e.target.value)}
              className="w-32 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Duration (Years)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              value={inputs.years}
              onChange={(e) => handleChange('years', Number(e.target.value))}
              className="pl-10 block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
            />
          </div>
        </div>

        {/* Step Up Contribution */}
        <div>
           <div className="flex justify-between mb-2">
             <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Annual Step-Up (%)</label>
             <div className="group relative">
                 <InformationCircleIcon className="w-4 h-4 text-slate-400 cursor-help" />
                 <div className="hidden group-hover:block absolute right-0 bottom-full mb-2 w-48 bg-slate-800 text-white text-xs rounded p-2 z-10">
                    Increase your contribution each year (e.g., to match salary raises).
                 </div>
             </div>
           </div>
           <input
             type="number"
             step="0.5"
             value={inputs.annualStepUp}
             onChange={(e) => handleChange('annualStepUp', Number(e.target.value))}
             className="block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
             placeholder="0"
           />
        </div>
      </div>

      {/* Advanced Toggle */}
      <div className="mt-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {showAdvanced ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" /> Hide Advanced Options
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" /> Show Advanced Options
            </>
          )}
        </button>

        {showAdvanced && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
             <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Compounding</label>
              <select
                value={inputs.compoundingFrequency}
                onChange={(e) => handleChange('compoundingFrequency', e.target.value)}
                className="block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Inflation Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.inflationRate}
                onChange={(e) => handleChange('inflationRate', Number(e.target.value))}
                className="block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Tax Rate (%)</label>
              <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.taxRate}
                    onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                    className="block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                  />
                  <select
                     value={inputs.taxTiming}
                     onChange={(e) => handleChange('taxTiming', e.target.value)}
                     className="rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                      <option value="end">End</option>
                      <option value="yearly">Yearly</option>
                  </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Target Goal</label>
              <input
                type="number"
                value={inputs.targetAmount}
                onChange={(e) => handleChange('targetAmount', Number(e.target.value))}
                className="block w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                placeholder="Optional"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          {isCalculating ? 'Analysing...' : 'Calculate Growth'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;