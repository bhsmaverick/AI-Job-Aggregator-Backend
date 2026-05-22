'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SearchWidget, { Job } from '@/components/search-widget';
import MatchWidget from '@/components/match-widget';
import { Sparkles, ArrowDown, CheckCircle2, Cpu, FileText, Code, LineChart, Award, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('Index');
  const tInfo = useTranslations('LandingInfo');
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
          <Sparkles size={14} /> {tInfo('heroBadge')}
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

      {/* Trusted By Section */}
      <section className="py-12 border-b border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-8">{tInfo('trustedBy')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Mock logos text based */}
            <span className="text-xl font-bold text-white uppercase tracking-tighter">Google</span>
            <span className="text-xl font-semibold text-white tracking-tight">Meta</span>
            <span className="text-xl font-bold text-white tracking-widest">AMAZON</span>
            <span className="text-xl font-serif italic text-white leading-none">Apple</span>
            <span className="text-xl font-bold text-white">NETFLIX</span>
          </div>
        </div>
      </section>

      {/* Main Content Area: Search -> Deep Dive -> Use Cases -> FAQ -> CTA */}
      <div id="search-section" className="flex-1 w-full px-4 md:px-8 py-20 flex flex-col items-center border-b border-slate-900">
        {!selectedJob ? (
          <SearchWidget onJobSelect={setSelectedJob} />
        ) : (
          <MatchWidget job={selectedJob} onBack={() => setSelectedJob(null)} />
        )}
      </div>

      {/* How It Works Section */}
      <section className="py-24 bg-[#0a0a0a] border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{tInfo('howItWorksTitle')}</h2>
            <p className="text-lg text-slate-400">{tInfo('howItWorksSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText size={80} />
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{tInfo('step1Title')}</h3>
              <p className="text-slate-400 leading-relaxed">{tInfo('step1Desc')}</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={80} />
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{tInfo('step2Title')}</h3>
              <p className="text-slate-400 leading-relaxed">{tInfo('step2Desc')}</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 size={80} />
              </div>
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 border border-amber-500/30">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{tInfo('step3Title')}</h3>
              <p className="text-slate-400 leading-relaxed">{tInfo('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-slate-950/30 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{tInfo('useCasesTitle')}</h2>
            <p className="text-lg text-slate-400">{tInfo('useCasesSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-slate-600 transition-colors">
              <Code className="text-slate-500 mb-6" size={32} />
              <h3 className="text-xl font-semibold text-white mb-3">{tInfo('juniorTitle')}</h3>
              <p className="text-slate-400 text-sm whitespace-pre-line">{tInfo('juniorDesc')}</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-slate-600 transition-colors">
              <LineChart className="text-slate-500 mb-6" size={32} />
              <h3 className="text-xl font-semibold text-white mb-3">{tInfo('midTitle')}</h3>
              <p className="text-slate-400 text-sm whitespace-pre-line">{tInfo('midDesc')}</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-slate-600 transition-colors">
              <Award className="text-slate-500 mb-6" size={32} />
              <h3 className="text-xl font-semibold text-white mb-3">{tInfo('seniorTitle')}</h3>
              <p className="text-slate-400 text-sm whitespace-pre-line">{tInfo('seniorDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0a0a] border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">{tInfo('faqTitle')}</h2>
          
          <div className="space-y-4">
            <details className="group border border-slate-800 bg-slate-900/50 rounded-xl [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-medium">
                {tInfo('faq1Q')}
                <ChevronDown className="transition-transform group-open:rotate-180 text-slate-500" size={20} />
              </summary>
              <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4 mt-2">
                {tInfo('faq1A')}
              </div>
            </details>
            
            <details className="group border border-slate-800 bg-slate-900/50 rounded-xl [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-medium">
                {tInfo('faq2Q')}
                <ChevronDown className="transition-transform group-open:rotate-180 text-slate-500" size={20} />
              </summary>
              <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4 mt-2">
                {tInfo('faq2A')}
              </div>
            </details>
            
            <details className="group border border-slate-800 bg-slate-900/50 rounded-xl [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-medium">
                {tInfo('faq3Q')}
                <ChevronDown className="transition-transform group-open:rotate-180 text-slate-500" size={20} />
              </summary>
              <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4 mt-2">
                {tInfo('faq3A')}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Secondary Bottom CTA */}
      <section className="py-32 relative overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{tInfo('bottomCtaTitle')}</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">{tInfo('bottomCtaSubtitle')}</p>
          <button 
            onClick={scrollToSearch}
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
          >
            {tInfo('bottomCtaButton')}
          </button>
        </div>
      </section>

      <footer className="text-center py-12 border-t border-slate-900 text-slate-600 text-sm font-mono">
        {tInfo('footer', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
