'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FileText, Loader2, Target, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { Job } from './search-widget';
import { signIn } from 'next-auth/react';

export default function MatchWidget({ job, onBack }: { job: Job, onBack: () => void }) {
  const t = useTranslations('Index');
  const locale = useLocale();
  const [cvText, setCvText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!cvText.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('cvText', cvText);
      formData.append('jobId', job.id);
      
      const res = await fetch('/api/v1/jobs/match', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setResult(data.match_result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12" id="match-widget">
      <button onClick={onBack} className="text-slate-400 hover:text-white mb-6 font-mono text-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2">
        ← Back to Search
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 shadow-2xl">
        <h2 className="text-2xl font-medium text-white mb-2">Target Role: {job.title}</h2>
        <p className="text-slate-400 font-mono text-sm mb-6 pb-6 border-b border-slate-800">{job.company} • {job.location}</p>
        
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-indigo-400 font-medium font-mono uppercase text-sm">
            <FileText size={16} /> 
            {t('pasteCv')}
          </label>
          <textarea 
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            className="w-full h-48 bg-slate-950 border border-slate-800 text-slate-300 p-4 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-xs resize-none"
            placeholder="Experience: Software Engineer..."
          />
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !cvText.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Target />}
            {t('analyze')}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Score Card */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Target size={120} />
            </div>
            <h3 className="text-slate-300 font-mono uppercase tracking-wider text-sm mb-4">{t('matchScoreTitle')}</h3>
            <div className="text-6xl font-medium text-white flex items-baseline gap-2">
              <span className={result.match_percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                {result.match_percentage}
              </span>
              <span className="text-2xl text-slate-500">/100</span>
            </div>
          </div>
          
          {/* Missing Skills */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={18} />
              Missing Keywords/Skills
            </h3>
            <ul className="space-y-3">
              {result.missing_skills.map((skill: string, i: number) => (
                <li key={i} className="flex gap-3 text-slate-300 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                  <span className="text-sm">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ATS Tips */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 md:col-span-2">
             <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={18} />
              ATS Optimization Tips
            </h3>
            <ul className="space-y-3">
              {result.ats_optimization_tips.map((tip: string, i: number) => (
                <li key={i} className="flex gap-3 text-slate-300 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Wall */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-xl p-8 md:col-span-2 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 text-indigo-400">
              <Lock size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">{t('coverLetterLocked')}</h3>
            <p className="text-slate-400 mb-6 text-sm max-w-xl mx-auto">Generate a highly tailored cover letter in your native language, specifically optimized to pass this job&apos;s ATS filters and grab the recruiter&apos;s attention.</p>
            <button onClick={() => signIn('google', { callbackUrl: `/${locale}/dashboard` })} className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('loginToUnlock')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
