import React, { useState } from 'react';
import { CalculationResult, YearlyData, CURRENCIES } from '../types';
import { formatCurrency } from '../services/calculatorService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, ReferenceLine
} from 'recharts';
import { ArrowDownTrayIcon, ShareIcon, PrinterIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface Props {
  data: CalculationResult;
  currency: string;
  years: number;
}

const ResultsSection: React.FC<Props> = ({ data, currency, years }) => {
  const [showVariance, setShowVariance] = useState(false);
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  const formatMoney = (val: number) => formatCurrency(val, currency);

  const pieData = [
    { name: 'Total Invested', value: data.totalDeposits, color: '#3b82f6' }, // blue-500
    { name: 'Total Interest', value: data.totalInterest, color: '#10b981' }, // emerald-500
  ];
  
  if (data.totalTax > 0) {
      pieData.push({ name: 'Tax Paid', value: data.totalTax, color: '#ef4444' }); // red-500
  }

  const downloadCSV = () => {
    const headers = ['Year', 'Principal', 'Contributions', 'Total Invested', 'Total Interest', 'Balance', 'Inflation Adjusted'];
    const rows = data.yearlyBreakdown.map(row => [
      row.year,
      row.principal.toFixed(2),
      row.contributions.toFixed(2),
      (row.principal + row.contributions).toFixed(2),
      row.interest.toFixed(2),
      row.totalBalance.toFixed(2),
      row.inflationAdjusted.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "compound_interest_breakdown.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn print:space-y-4">
      
      {/* Goal Banner */}
      {data.goalReachedYear !== null && data.goalReachedYear > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-full">
                  <CheckBadgeIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Goal Achieved!</h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      You will reach your target in <span className="font-bold">Year {data.goalReachedYear}</span>.
                  </p>
              </div>
          </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg shadow-blue-900/20 relative overflow-hidden print:shadow-none print:border print:border-slate-200">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Maturity Value (after {years} Years)</p>
            <h3 className="text-3xl font-bold">{formatMoney(data.finalBalance)}</h3>
            {data.finalBalanceAdjusted !== data.finalBalance && (
                <p className="text-xs text-blue-200 mt-2">
                    Adjusted for Inflation: {formatMoney(data.finalBalanceAdjusted)}
                </p>
            )}
          </div>
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 print:hidden">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Interest Earned</p>
          <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(data.totalInterest)}</h3>
          <p className="text-xs text-slate-400 mt-2">Gross (Before Tax)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Invested</p>
          <h3 className="text-3xl font-bold text-slate-700 dark:text-slate-200">{formatMoney(data.totalDeposits)}</h3>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${(data.totalDeposits / data.finalBalance) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
             <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Rule of 72</p>
             <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{data.doublingTime.toFixed(1)} Yrs</p>
             <p className="text-[10px] text-slate-400">Time to double money</p>
         </div>
         <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
             <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Multiplier</p>
             <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{data.multiplier.toFixed(2)}x</p>
             <p className="text-[10px] text-slate-400">Total ROI</p>
         </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
             <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Eff. Rate</p>
             <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{(data.totalInterest / data.totalDeposits * 100).toFixed(0)}%</p>
             <p className="text-[10px] text-slate-400">Total Return %</p>
         </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
             <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Tax Paid</p>
             <p className="text-xl font-bold text-red-500 mt-1">{formatMoney(data.totalTax)}</p>
             <p className="text-[10px] text-slate-400">Estimated Tax</p>
         </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
             <h4 className="text-lg font-bold text-slate-800 dark:text-white">Growth Over Time</h4>
             <div className="flex gap-2">
                 <button 
                   onClick={() => setShowVariance(!showVariance)}
                   className={`text-xs px-3 py-1 rounded-full border transition-colors ${showVariance ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}
                 >
                    Variance (+/- 2%)
                 </button>
             </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.yearlyBreakdown} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${currencySymbol}${val/1000}k`} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'var(--tooltip-text)' }}
                  formatter={(value: number) => formatMoney(value)}
                  labelStyle={{ color: '#64748b' }}
                />
                
                {showVariance && (
                    <>
                    <Area type="monotone" dataKey="optimisticBalance" name="Optimistic (+2%)" stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                    <Area type="monotone" dataKey="pessimisticBalance" name="Pessimistic (-2%)" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                    </>
                )}

                <Area type="monotone" dataKey="totalBalance" name="Balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="contributions" stackId="1" name="Deposits" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
                
                {data.goalReachedYear && (
                    <ReferenceLine x={data.goalReachedYear} stroke="#10b981" label={{ value: 'Goal', position: 'insideTopRight', fill: '#10b981' }} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 w-full text-left">Allocation</h4>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatMoney(value)} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <div className="mt-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Your money working for you.</p>
             </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden print:shadow-none">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 dark:border-slate-700 gap-4">
          <h4 className="text-lg font-bold text-slate-800 dark:text-white">Yearly Breakdown</h4>
          <div className="flex gap-2 print:hidden">
            <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
            >
                <ShareIcon className="w-4 h-4" /> Share
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
            >
                <PrinterIcon className="w-4 h-4" /> Print
            </button>
            <button 
                onClick={downloadCSV}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-4 py-2 rounded-lg transition-colors"
            >
                <ArrowDownTrayIcon className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white font-semibold">
              <tr>
                <th className="p-4">Year</th>
                <th className="p-4">Total Invested</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Balance</th>
                <th className="p-4 text-slate-400">Real Value (Inflation)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {data.yearlyBreakdown.map((yearData) => (
                <tr key={yearData.year} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{yearData.year}</td>
                  <td className="p-4">{formatMoney(yearData.principal + yearData.contributions)}</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400">+{formatMoney(yearData.interest)}</td>
                  <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{formatMoney(yearData.totalBalance)}</td>
                  <td className="p-4 text-slate-400">{formatMoney(yearData.inflationAdjusted)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;