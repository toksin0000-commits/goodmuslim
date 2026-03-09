'use client';

import { useEffect, useState } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { prayers } from '@/lib/daily-prayers';
import { dailyVerses } from '@/lib/daily-verses';
import Link from 'next/link';

export default function HomePage(props: { params: Promise<{ lang: 'ar' | 'en' | 'ur' }> }) {
  const [dict, setDict] = useState<any>(null);
  const [lang, setLang] = useState<'ar' | 'en' | 'ur'>('ar');
  const [dailyVerse, setDailyVerse] = useState<{ text: string; reference: string } | null>(null);
  const [dailyPrayer, setDailyPrayer] = useState<string>('');

  useEffect(() => {
    async function load() {
      const { lang } = await props.params;
      setLang(lang);
      setDict(getDictionary(lang));
      
      // Nastavení denního verše a modlitby podle data
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      
      // Výběr verše (pro každý jazyk)
      const versesInLang = dailyVerses[lang] || dailyVerses.ar;
      const verseIndex = dayOfYear % versesInLang.length;
      setDailyVerse(versesInLang[verseIndex]);
      
      // Výběr modlitby (pro každý jazyk)
      const prayersInLang = prayers[lang] || prayers.ar;
      const prayerIndex = (dayOfYear + 7) % prayersInLang.length; // +7 aby nebyl stejný index jako verš
      setDailyPrayer(prayersInLang[prayerIndex]);
    }
    load();
  }, [props.params]);

  if (!dict) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-16">


      <div className="mb-15 flex items-center justify-center gap-4">
  <span className="text-3xl text-[#000000]">☪</span>
  <h1 className="text-3xl font-light text-[#000000]">Good Muslim</h1>
  <span className="text-3xl text-[#000000]">☪</span>
</div>
<p className="text-xs text-gray-400 tracking-widest -mt-4">{dict.subtitle}</p>
     
     
      {/* Denní verš */}
      <div>
        <h1 className="text-sm text-gray-500 tracking-[0.2em] uppercase">
          {dict.verse_of_day}
        </h1>
        {dailyVerse && (
          <>
            <p className="mt-3 text-xl text-red-800">{dailyVerse.text}</p>
            <p className="mt-1 text-sm text-gray-500">{dailyVerse.reference}</p>
          </>
        )}
      </div>

      {/* Denní modlitba */}
      <div className="mt-16">
        <h2 className="text-sm text-gray-500 tracking-[0.2em] uppercase">
          {dict.prayer_of_day}
        </h2>
        <p className="mt-3 max-w-md text-black">{dailyPrayer}</p>
      </div>


      {/* Navigace dole */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-300 bg-gray-100/90 backdrop-blur-sm flex items-center justify-around text-2xl">
        <Link href={`/${lang}/quran`}>📜</Link>
        <Link href={`/${lang}/wishes`}>📿</Link>
        <Link href={`/${lang}/mosques`}>🕌</Link>
      </nav>
    </div>
  );
}