'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, User } from 'lucide-react';

const LANGUAGES = ['en', 'es', 'pt', 'de', 'fr', 'ua', 'pl', 'ja', 'ar', 'tr', 'hi', 'it', 'ko', 'id'];

export default function Header({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const currentPathname = pathname || '/';
    const pathParts = currentPathname.split('/');
    
    if (pathParts.length > 1 && LANGUAGES.includes(pathParts[1])) {
      pathParts[1] = newLocale;
      router.push(pathParts.join('/'));
    } else {
      router.push(`/${newLocale}`);
    }
  };

  return (
    <header className="fixed top-0 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-50 h-16 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-mono text-indigo-400 font-bold uppercase tracking-widest text-xs md:text-sm hover:text-indigo-300 transition-colors">
          {t('logo')}
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-slate-300 font-mono text-sm max-w-24 md:max-w-none">
            <Globe size={16} className="hidden md:block" />
            <select 
              value={locale} 
              onChange={handleLocaleChange}
              className="bg-transparent border-none focus:ring-0 cursor-pointer uppercase outline-none text-xs md:text-sm py-1 pl-1 pr-6 hover:text-white transition-colors"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang} className="bg-slate-900">{lang}</option>
              ))}
            </select>
          </div>

          {session ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href={`/${locale}/dashboard`} className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                {t('dashboard')}
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors"
                title={t('logout')}
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn('google', { callbackUrl: `/${locale}/dashboard` })}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
            >
              <User size={14} className="md:hidden" />
              <span className="hidden md:inline">{t('login')}</span>
              <span className="md:hidden">{t('login')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
