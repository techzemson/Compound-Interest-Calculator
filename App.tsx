import React, { useState, useCallback, useEffect, useRef } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import ProgressBar from './components/ProgressBar';
import HistoryPanel from './components/HistoryPanel';
import DocumentationModal from './components/DocumentationModal';
import { CalculatorInputs, CalculationResult, HistoryItem } from './types';
import { calculateCompoundInterest } from './services/calculatorService';
import { CalculatorIcon, MoonIcon, SunIcon, ClockIcon, BookOpenIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialDeposit: 10000,
    contribution: 500,
    contributionFrequency: 'monthly',
    annualStepUp: 0,
    interestRate: 7,
    years: 10,
    compoundingFrequency: 'monthly',
    inflationRate: 2.5,
    taxRate: 0,
    taxTiming: 'end',
    currency: 'USD',
    targetAmount: 0
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Apply Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-900');
      document.body.classList.remove('bg-slate-50');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-900');
      document.body.classList.add('bg-slate-50');
    }
  }, [darkMode]);

  // Load History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
    
    // Check URL Params for shared state
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (dataParam) {
        try {
            const decoded = JSON.parse(atob(dataParam));
            setInputs(prev => ({ ...prev, ...decoded }));
        } catch(e) {
            console.error('Invalid URL data');
        }
    }
  }, []);

  // Save History
  const addToHistory = (inputs: CalculatorInputs, finalBalance: number) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs: { ...inputs }, // Copy
      finalBalance
    };
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('calc_history', JSON.stringify(newHistory));
  };

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setProgress(0);
    
    // Update URL
    try {
      // Only attempt to update URL if not in a blob/sandbox that prohibits it
      if (typeof window !== 'undefined' && window.location.protocol !== 'blob:' && window.location.protocol !== 'about:') {
          const encoded = btoa(JSON.stringify(inputs));
          window.history.replaceState(null, '', `?data=${encoded}`);
      }
    } catch (e) {
      // Silently fail in restricted environments to avoid console errors
    }

    // Faster Simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10; // Faster increment
      });
    }, 30); // Faster interval

    // Reduced timeout for snappier feel
    setTimeout(() => {
      clearInterval(interval);
      try {
        const data = calculateCompoundInterest(inputs);
        setResult(data);
        addToHistory(inputs, data.finalBalance);
        
        // Auto scroll to results
        setTimeout(() => {
           if (resultsRef.current) {
              resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
           }
        }, 100);
      } catch (error) {
        console.error("Calculation failed:", error);
        alert("An error occurred during calculation. Please check your inputs.");
      } finally {
        setIsCalculating(false);
        setProgress(100);
      }
    }, 400); // 400ms delay

  }, [inputs, history]);

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <CalculatorIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight hidden sm:block">
              Compound <span className="text-blue-600 dark:text-blue-400">Interest</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowDocumentation(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium text-sm md:text-base"
            >
                <BookOpenIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Documentation</span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative font-medium text-sm md:text-base"
            >
                <ClockIcon className="w-5 h-5" />
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && <span className="absolute top-2 left-6 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-slate-800"></span>}
            </button>
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-1"
                aria-label="Toggle Dark Mode"
            >
                {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-600" />}
            </button>
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
                 <h2 className="text-3xl font-bold mb-2">Plan your future</h2>
                 <p className="text-slate-500 dark:text-slate-400">Input your investment details to simulate wealth generation over time.</p>
               </div>
               <InputSection 
                 inputs={inputs} 
                 setInputs={setInputs} 
                 onCalculate={handleCalculate}
                 isCalculating={isCalculating}
               />
               
               <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50 hidden xl:block">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Did you know?</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-200 leading-relaxed">
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
               <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-4">
                     <CalculatorIcon className="w-10 h-10 text-slate-300 dark:text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-400 dark:text-slate-500">Ready to Calculate</h3>
                  <p className="text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-2">Enter your investment details on the left to see your financial projection.</p>
               </div>
             )}
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isCalculating && <ProgressBar progress={progress} />}
      
      {/* History Panel */}
      <HistoryPanel 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={history}
        onSelect={(item) => setInputs(item.inputs)}
        onClear={() => { setHistory([]); localStorage.removeItem('calc_history'); }}
      />

      {/* Documentation Modal */}
      <DocumentationModal 
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
    </div>
  );
};

export default App;