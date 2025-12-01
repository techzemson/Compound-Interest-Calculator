import React, { useState } from 'react';
import { CalculatorInputs, CURRENCIES } from '../types';
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  BanknotesIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon
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

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 md:p-8 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-600" />
        Configuration
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-600 mb-2">Currency</label>
          <div className="relative">
            <select
              value={inputs.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 appearance-none cursor-pointer font-medium"
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
          <label className="block text-sm font-semibold text-slate-600 mb-2">Initial Deposit</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BanknotesIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              value={inputs.initialDeposit}
              onChange={(e) => handleChange('initialDeposit', Number(e.target.value))}
              className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Interest Rate (%)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ChartBarIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              step="0.1"
              value={inputs.interestRate}
              onChange={(e) => handleChange('interestRate', Number(e.target.value))}
              className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              placeholder="5"
            />
          </div>
        </div>

        {/* Regular Contribution */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Regular Contribution</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                value={inputs.contribution}
                onChange={(e) => handleChange('contribution', Number(e.target.value))}
                className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              />
            </div>
            <select
              value={inputs.contributionFrequency}
              onChange={(e) => handleChange('contributionFrequency', e.target.value)}
              className="rounded-xl border-slate-200 bg-slate-50 border text-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Duration (Years)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              value={inputs.years}
              onChange={(e) => handleChange('years', Number(e.target.value))}
              className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
            />
          </div>
        </div>
      </div>

      {/* Advanced Toggle */}
      <div className="mt-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
             <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Compounding</label>
              <select
                value={inputs.compoundingFrequency}
                onChange={(e) => handleChange('compoundingFrequency', e.target.value)}
                className="block w-full rounded-xl border-slate-200 bg-slate-50 border text-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Inflation Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.inflationRate}
                onChange={(e) => handleChange('inflationRate', Number(e.target.value))}
                className="block w-full rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Tax on Interest (%)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.taxRate}
                onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                className="block w-full rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          {isCalculating ? 'Analysing...' : 'Calculate Growth'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
