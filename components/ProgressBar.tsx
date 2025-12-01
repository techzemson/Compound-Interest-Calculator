import React from 'react';

interface Props {
  progress: number;
}

const ProgressBar: React.FC<Props> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Analyzing Growth...</h3>
        <p className="text-slate-500 text-center text-sm mb-6">Calculating compound effects and inflation adjustments.</p>
        
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-2">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-100 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-end">
            <span className="text-xs font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
