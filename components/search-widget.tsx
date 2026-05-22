'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
};

export default function SearchWidget({ onJobSelect }: { onJobSelect: (job: Job) => void }) {
  const t = useTranslations('Index');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Job[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/v1/jobs/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.hits || []);
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12" id="search-section">
      <form onSubmit={handleSearch} className="relative flex items-center mb-8">
        <Search className="absolute left-4 text-slate-400" size={24} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl"
        />
        <button 
          type="submit" 
          className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
          disabled={isSearching}
        >
          {isSearching ? <Loader2 className="animate-spin" /> : "Search"}
        </button>
      </form>

      <div className="space-y-4">
        {hasSearched && results.length === 0 && !isSearching && (
          <p className="text-center text-slate-400">No jobs found. Try a different query.</p>
        )}
        
        {results.map(job => (
          <div key={job.id} onClick={() => onJobSelect(job)} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 cursor-pointer hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium text-white mb-1 group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                <p className="text-slate-400 font-mono text-sm mb-4">{job.company} • {job.location}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4 line-clamp-2">{job.description}</p>
            <div className="flex gap-2 flex-wrap">
              {job.skills.map(skill => (
                <span key={skill} className="px-2 py-1 text-xs font-mono bg-slate-800 text-slate-300 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
