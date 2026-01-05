'use client'

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Quizly</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Sign in</button>
          <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm">
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
