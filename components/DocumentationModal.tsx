import React from 'react';
import { XMarkIcon, BookOpenIcon, LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>

        {/* Spacer for centering */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full border border-slate-200 dark:border-slate-700">
            
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BookOpenIcon className="w-6 h-6 text-blue-600" />
                    User Guide & Documentation
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-8 sm:px-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="prose dark:prose-invert max-w-none">
                    
                    {/* Intro Section */}
                    <div className="mb-12">
                        <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">How to Use This Tool</h4>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 text-base leading-relaxed">
                            This Compound Interest Calculator is designed to help you visualize how your money can grow over time. 
                            It goes beyond simple calculators by accounting for real-world factors like inflation, taxes, and increasing contributions.
                        </p>
                        
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
                            <ol className="list-decimal pl-5 space-y-4 text-slate-700 dark:text-slate-300">
                                <li>
                                    <span className="font-bold text-slate-900 dark:text-white">Initial Input:</span> Enter your starting amount (Principal) and how much you plan to contribute regularly.
                                </li>
                                <li>
                                    <span className="font-bold text-slate-900 dark:text-white">Set Strategy:</span> Choose your investment duration (years) and expected annual interest rate.
                                </li>
                                <li>
                                    <span className="font-bold text-slate-900 dark:text-white">Refine (Advanced):</span> Click "Show Advanced Options" to add inflation rates, tax implications, and annual contribution increases (Step-Up) to make the simulation realistic.
                                </li>
                                <li>
                                    <span className="font-bold text-slate-900 dark:text-white">Analyze:</span> Hit "Calculate Growth" to generate detailed charts, breakdowns, and summary statistics.
                                </li>
                            </ol>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 hover:shadow-lg transition-shadow">
                            <h5 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                                <LightBulbIcon className="w-6 h-6" /> Key Features
                            </h5>
                            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex gap-2">
                                    <span className="text-blue-500 font-bold">•</span> 
                                    <span><strong>Annual Step-Up:</strong> Simulate salary hikes by increasing your monthly contribution by a percentage each year.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-500 font-bold">•</span> 
                                    <span><strong>Inflation Adjustment:</strong> See the "Real Value" of your future money in today's terms.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-500 font-bold">•</span> 
                                    <span><strong>Tax Modeling:</strong> Deduct taxes yearly or at maturity (Deferred) to see your net returns.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-500 font-bold">•</span> 
                                    <span><strong>Variance Analysis:</strong> Toggle the chart to view "Optimistic" (+2%) and "Pessimistic" (-2%) scenarios.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 hover:shadow-lg transition-shadow">
                            <h5 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
                                <ChartBarIcon className="w-6 h-6" /> Understanding Results
                            </h5>
                            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex gap-2">
                                    <span className="text-emerald-500 font-bold">•</span> 
                                    <span><strong>Maturity Value:</strong> The total value of your investment at the end of the period.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-emerald-500 font-bold">•</span> 
                                    <span><strong>Rule of 72:</strong> An estimate of how many years it takes to double your money at the given rate.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-emerald-500 font-bold">•</span> 
                                    <span><strong>Multiplier:</strong> How many times your money has grown (e.g., 5.2x means you have 5 times what you put in).</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-emerald-500 font-bold">•</span> 
                                    <span><strong>Effective Rate:</strong> The actual percentage return calculated on your total invested capital.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div>
                         <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Why use this calculator?</h4>
                         <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Most calculators are too simple—they assume you contribute the same amount forever and ignore taxes or inflation. 
                            However, in real life, your income grows, inflation reduces purchasing power, and taxes eat into returns. 
                            <br/><br/>
                            This tool bridges the gap between simple math and complex financial planning, giving you a 
                            <span className="font-bold text-slate-800 dark:text-white bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded"> professional-grade projection</span> 
                            completely for free. Use it to plan for retirement, a child's education, or financial independence with confidence.
                         </p>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button 
                    onClick={onClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                >
                    Got it, Let's Calculate!
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;