import React, { useState, useCallback, useEffect, useRef } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import ProgressBar from './components/ProgressBar';
import { CalculatorInputs, CalculationResult } from './types';
import { calculateCompoundInterest } from './services/calculatorService';
import { CalculatorIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialDeposit: 10000,
    contribution: 500,
    contributionFrequency: 'monthly',
    interestRate: 7,
    years: 10,
    compoundingFrequency: 'monthly',
    inflationRate: 2.5,
    taxRate: 0,
    currency: 'USD',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setProgress(0);
    setResult(null);

    // Simulate analysis time for better UX perception of "work"
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5; // Increment speed
      });
    }, 40); // Total approx 800ms

    // Perform calculation when "done"
    setTimeout(() => {
      const data = calculateCompoundInterest(inputs);
      setResult(data);
      setIsCalculating(false);
      setProgress(0);
    }, 1000);

  }, [inputs]);

  useEffect(() => {
    // Auto-scroll to results when they appear
    if (result && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <CalculatorIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              Compound Interest <span className="text-blue-600">Calculator</span>
            </h1>
          </div>
          {/* Simple Nav or Actions could go here */}
          <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
             v2.0 Pro
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="xl:col-span-4">
            <div className="xl:sticky xl:top-24">
               <div className="mb-6">
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">Plan your future</h2>
                 <p className="text-slate-500">Input your investment details to simulate wealth generation over time.</p>
               </div>
               <InputSection 
                 inputs={inputs} 
                 setInputs={setInputs} 
                 onCalculate={handleCalculate}
                 isCalculating={isCalculating}
               />
               
               <div className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-100 hidden xl:block">
                  <h4 className="font-bold text-blue-800 mb-2">Did you know?</h4>
                  <p className="text-sm text-blue-600 leading-relaxed">
                    Albert Einstein reputedly called compound interest the "eighth wonder of the world". He who understands it, earns it... he who doesn't... pays it.
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="xl:col-span-8" ref={resultsRef}>
             {result ? (
               <ResultsSection 
                 data={result} 
                 currency={inputs.currency} 
                 years={inputs.years} 
               />
             ) : (
               <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                     <CalculatorIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-400">Ready to Calculate</h3>
                  <p className="text-slate-400 max-w-xs mx-auto mt-2">Enter your investment details on the left to see your financial projection.</p>
               </div>
             )}
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isCalculating && <ProgressBar progress={progress} />}
    </div>
  );
};

export default App;