
import React from 'react';
import { Github, Twitter, Linkedin, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Quizly</span>
            </div>
            <p className="text-slate-500 max-w-xs mb-10 text-lg leading-relaxed">
              A minimalist space for interactive assessment and collaborative learning.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-8">Product</h4>
            <ul className="space-y-5 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Creator Studio</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Student Mode</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-8">Resources</h4>
            <ul className="space-y-5 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Guidebook</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm font-medium">
          <p>© 2024 Quizly. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
