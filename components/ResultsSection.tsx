import React from 'react';
import { CalculationResult, YearlyData, CURRENCIES } from '../types';
import { formatCurrency } from '../services/calculatorService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';

interface Props {
  data: CalculationResult;
  currency: string;
  years: number;
}

const ResultsSection: React.FC<Props> = ({ data, currency, years }) => {
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  const formatMoney = (val: number) => formatCurrency(val, currency);

  const pieData = [
    { name: 'Total Deposits', value: data.totalDeposits, color: '#3b82f6' }, // blue-500
    { name: 'Total Interest', value: data.totalInterest, color: '#10b981' }, // emerald-500
  ];
  
  if (data.totalTax > 0) {
      pieData.push({ name: 'Tax Paid', value: data.totalTax, color: '#ef4444' }); // red-500
  }

  const downloadCSV = () => {
    const headers = ['Year', 'Principal', 'Contributions', 'Total Interest', 'Balance', 'Inflation Adjusted'];
    const rows = data.yearlyBreakdown.map(row => [
      row.year,
      row.principal.toFixed(2),
      row.contributions.toFixed(2),
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

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg shadow-blue-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Maturity Value (after {years} Years)</p>
            <h3 className="text-3xl font-bold">{formatMoney(data.finalBalance)}</h3>
            {data.finalBalanceAdjusted !== data.finalBalance && (
                <p className="text-xs text-blue-200 mt-2">
                    Adjusted for Inflation: {formatMoney(data.finalBalanceAdjusted)}
                </p>
            )}
          </div>
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Interest Earned</p>
          <h3 className="text-3xl font-bold text-emerald-600">{formatMoney(data.totalInterest)}</h3>
          <p className="text-xs text-slate-400 mt-2">Before Tax</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Deposits</p>
          <h3 className="text-3xl font-bold text-slate-700">{formatMoney(data.totalDeposits)}</h3>
          <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${(data.totalDeposits / data.finalBalance) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Growth Over Time</h4>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.yearlyBreakdown} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${currencySymbol}${val/1000}k`} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                  itemStyle={{ color: '#1e293b' }}
                  formatter={(value: number) => formatMoney(value)}
                />
                <Area type="monotone" dataKey="totalBalance" name="Balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="contributions" stackId="1" name="Deposits" stroke="#cbd5e1" strokeWidth={2} fill="url(#colorInvested)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center">
            <h4 className="text-lg font-bold text-slate-800 mb-4 w-full text-left">Allocation</h4>
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
                <p className="text-sm text-slate-500">Your money working for you.</p>
             </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 gap-4">
          <h4 className="text-lg font-bold text-slate-800">Yearly Breakdown</h4>
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" /> Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold">
              <tr>
                <th className="p-4">Year</th>
                <th className="p-4">Deposits</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Balance</th>
                <th className="p-4 text-slate-400">Real Value (Inflation)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.yearlyBreakdown.map((yearData) => (
                <tr key={yearData.year} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{yearData.year}</td>
                  <td className="p-4">{formatMoney(yearData.principal + yearData.contributions)}</td>
                  <td className="p-4 text-emerald-600">+{formatMoney(yearData.interest)}</td>
                  <td className="p-4 font-bold text-blue-600">{formatMoney(yearData.totalBalance)}</td>
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