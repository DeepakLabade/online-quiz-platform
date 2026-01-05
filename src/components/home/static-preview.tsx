
import React from 'react';

export const StaticPreview: React.FC = () => {
  return (
    <section className="py-24 bg-white border-y border-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative p-1 bg-slate-100 rounded-[2.5rem] shadow-2xl">
          <div className="bg-white rounded-[2.25rem] overflow-hidden border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question 1 of 10</span>
            </div>
            
            <div className="p-12 md:p-16 max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 text-center leading-tight">
                Which of these architectural styles is characterized by flying buttresses and pointed arches?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Baroque', 'Gothic', 'Renaissance', 'Neoclassical'].map((option, i) => (
                  <div 
                    key={i} 
                    className={`p-6 rounded-2xl border-2 text-lg font-semibold transition-all cursor-pointer ${
                      option === 'Gothic' 
                        ? 'border-slate-900 bg-slate-900 text-white' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              
              <div className="mt-12 flex justify-center">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/10 bg-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-slate-400 text-sm font-medium">Clean interface designed for maximum focus.</p>
      </div>
    </section>
  );
};
