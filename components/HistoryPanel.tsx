import React from 'react';
import { HistoryItem } from '../types';
import { XMarkIcon, ClockIcon, ArrowUturnLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../services/calculatorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<Props> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-sm w-full flex">
        <div className="w-full h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ClockIcon className="w-6 h-6 text-blue-600" />
              History
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="text-center text-slate-400 dark:text-slate-500 mt-10">
                <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No calculations yet.</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                      {item.inputs.years} Years
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {formatCurrency(item.finalBalance, item.inputs.currency)}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.inputs.initialDeposit} + {item.inputs.contribution}/{item.inputs.contributionFrequency === 'monthly' ? 'mo' : 'yr'} @ {item.inputs.interestRate}%
                    </p>
                  </div>

                  <button 
                    onClick={() => { onSelect(item); onClose(); }}
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4" /> Restore
                  </button>
                </div>
              ))
            )}
          </div>

          {history.length > 0 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={onClear}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                <TrashIcon className="w-4 h-4" /> Clear History
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;