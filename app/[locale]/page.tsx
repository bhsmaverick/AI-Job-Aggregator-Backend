'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SearchWidget, { Job } from '@/components/search-widget';
import MatchWidget from '@/components/match-widget';
import { Sparkles, ArrowDown } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('Index');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const scrollToSearch = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative w-full py-24 md:py-40 flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-slate-900 leading-tight">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950/20 to-[#0a0a0a] -z-10" />
        
        <div className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-semibold px-4 py-1.5 rounded-full mb-8 inline-flex items-center gap-2 uppercase tracking-widest border border-indigo-500/20">
          <Sparkles size={14} /> AI-Powered Job Aggregator
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white max-w-4xl mb-8">
          {t('title')}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
          {t('subtitle')}
        </p>

        <button 
          onClick={scrollToSearch}
          className="group flex items-center justify-center w-14 h-14 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600 transition-colors"
        >
          <ArrowDown className="text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 md:px-8 py-12 flex flex-col items-center">
        {!selectedJob ? (
          <SearchWidget onJobSelect={setSelectedJob} />
        ) : (
          <MatchWidget job={selectedJob} onBack={() => setSelectedJob(null)} />
        )}
      </main>

      <footer className="text-center py-12 border-t border-slate-900 text-slate-600 text-sm font-mono">
        &copy; {new Date().getFullYear()} Target AI Resume Analyzer.
      </footer>
    </div>
  );
}
