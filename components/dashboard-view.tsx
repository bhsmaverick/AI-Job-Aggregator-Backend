'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileUp, Target, Save, CheckCircle2, AlertTriangle, Download, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';

const MOCK_SAVED_JOBS = [
  {
    id: 'job_1',
    title: 'Senior Frontend Engineer (React/Next.js)',
    company: 'TechNova',
    location: 'Remote',
    match_percentage: 78,
    missing_skills: ['Docker', 'GraphQL'],
    ats_tips: ['Use more action verbs in your recent experience', 'Highlight quantifiable metrics']
  },
  {
    id: 'job_3',
    title: 'Full Stack Engineer (TypeScript/Node)',
    company: 'Innovate AI',
    location: 'San Francisco, CA (Hybrid)',
    match_percentage: 65,
    missing_skills: ['Elasticsearch'],
    ats_tips: ['Ensure keywords match exactly', 'Elaborate on backend responsibilities']
  }
];

const LANGUAGES = [
  'EN', 'ES', 'PT', 'DE', 'FR', 'UA', 'PL', 'JA', 'AR', 'TR', 'HI', 'IT', 'KO', 'ID'
];

export default function DashboardView() {
  const t = useTranslations('Dashboard');
  const { data: session } = useSession();
  
  const [cvSaved, setCvSaved] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  const [selectedJob, setSelectedJob] = useState<typeof MOCK_SAVED_JOBS[0] | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  
  const handleSaveCv = (e: React.FormEvent) => {
    e.preventDefault();
    if (cvFile) {
      setCvSaved(true);
      setTimeout(() => setCvSaved(false), 3000);
    }
  };

  if (selectedJob) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedJob(null)}
          className="text-slate-400 hover:text-white mb-6 font-mono text-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> {t('backToDashboard')}
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-medium text-white mb-2">{selectedJob.title}</h2>
          <p className="text-slate-400 font-mono text-sm border-b border-slate-800 pb-6">{selectedJob.company} • {selectedJob.location}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Score Card */}
            <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Target size={120} />
              </div>
              <h3 className="text-slate-300 font-mono uppercase tracking-wider text-sm mb-4">{t('matchScoreTitle')}</h3>
              <div className="text-6xl font-medium text-white flex items-baseline gap-2">
                <span className={selectedJob.match_percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                  {selectedJob.match_percentage}
                </span>
                <span className="text-2xl text-slate-500">/100</span>
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              {/* Missing Skills */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex-1">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" size={18} />
                  {t('missingSkills')}
                </h3>
                <ul className="space-y-2">
                  {selectedJob.missing_skills.map((skill, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 items-start">
                      <div className="w-1 h-1 rounded-full bg-slate-600 mt-2 shrink-0" />
                      <span className="text-sm">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ATS Tips */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex-1">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-400" size={18} />
                  {t('atsTips')}
                </h3>
                <ul className="space-y-2">
                  {selectedJob.ats_tips.map((tip, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 items-start">
                      <div className="w-1 h-1 rounded-full bg-slate-600 mt-2 shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800">
             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-slate-300 pr-4">
                  <p className="font-medium text-white text-lg">{t('downloadCoverLetter')}</p>
                  <p className="text-sm text-slate-400 mt-1">{t('downloadLanguageInfo')}</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 min-w-32 font-mono text-sm"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  
                  <button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Download size={18} /> Download 
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-slate-400">Welcome back, {session?.user?.name || 'User'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CV Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl sticky top-24">
            <h2 className="text-xl font-medium text-white mb-6 flex items-center justify-between">
              {t('cvSectionTitle')}
              <FileUp className="text-indigo-400" size={20} />
            </h2>
            
            <form onSubmit={handleSaveCv} className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-indigo-500/50 transition-colors group cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
                <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-300">
                  <FileUp size={32} className="mb-3" />
                  <span className="font-medium text-sm">
                    {cvFile ? cvFile.name : t('uploadPdf')}
                  </span>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={!cvFile}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
              >
                <Save size={18} />
                {t('saveCv')}
              </button>
              
              {cvSaved && (
                <p className="text-emerald-400 text-sm text-center font-medium animate-in fade-in">
                  {t('cvSavedText')}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Saved Jobs Map */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-medium text-white mb-6 flex items-center justify-between">
            {t('savedJobsTitle')}
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-mono font-medium">
              {MOCK_SAVED_JOBS.length} Jobs
            </span>
          </h2>
          
          <div className="space-y-4">
            {MOCK_SAVED_JOBS.map(job => (
              <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">{job.title}</h3>
                    <p className="text-slate-400 font-mono text-sm">{job.company} • {job.location}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 shrink-0 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      <Target size={14} className={job.match_percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'} />
                      <span className="font-mono text-sm font-medium text-white">{job.match_percentage}% Match</span>
                    </div>
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="w-full sm:w-auto bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 text-sm px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      {t('viewReport')}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {MOCK_SAVED_JOBS.length === 0 && (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
                 <p className="text-slate-400">{t('noSavedJobs')}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
