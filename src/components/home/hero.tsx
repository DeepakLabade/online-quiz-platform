"use client"

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-48 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-10 leading-[1.05]"
          >
            Quizzes made for <br />
            <span className="text-slate-400">modern learning.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-500 mb-14 leading-relaxed max-w-2xl mx-auto"
          >
            The intuitive home for interactive assessments. Create, share, and track progress with ease on a platform built for simplicity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="group px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              Start creating
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-24 flex items-center justify-center gap-10 text-slate-400 font-semibold text-xs uppercase tracking-[0.2em]"
          >
            <span>Minimalist</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span>Efficient</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span>Intuitive</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
