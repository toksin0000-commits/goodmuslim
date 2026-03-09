'use client';

import Link from 'next/link';
import { surahs, useQuran } from './useQuran';

interface QuranViewProps {
  lang: 'ar' | 'en' | 'ur';
}

export default function QuranView({ lang }: QuranViewProps) {
  const {
    surahId, ayahNumber, verses, loading, error,
    t, currentSurah, setSurahId, setAyahNumber, getSurahName
  } = useQuran(lang);

  return (
    <div className="p-6 flex flex-col gap-6" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 left-4" style={{ left: '1rem', right: 'auto' }}>
        <Link href={`/${lang}`} className="text-sm text-[#222] hover:underline bg-white/70 px-3 py-1 rounded-full shadow-sm shadow-black/50 inline-flex items-center justify-center h-9.5">
          {lang === 'ur' ? '→' : '←'} {t.home}
        </Link>
      </div>

      <div className="mt-20">
        
        <h1 className="text-3xl font-light text-center text-[#000000] mb-6 tracking-widest">
          {t.title}
        </h1>

        <div>
          <label className="block text-sm text-[#222] mb-1">{t.surah}</label>
          <select 
            value={surahId} 
            onChange={(e) => { 
              setSurahId(Number(e.target.value)); 
              setAyahNumber(1); 
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-[#222] shadow-inner shadow-black/10"
          >
            {surahs.map(s => (
              <option key={s.id} value={s.id}>
                {s.id}. {lang === 'ar' ? s.name_ar : lang === 'ur' ? s.name_ur : s.name_en}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-[#222] mb-1">{t.ayah}</label>
          <select 
            value={ayahNumber} 
            onChange={(e) => setAyahNumber(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-[#222] shadow-inner shadow-black/10"
          >
            {currentSurah && Array.from({ length: currentSurah.verses }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <h1 className="text-xl font-bold text-[#222] mt-6">
          {getSurahName(surahId)} {t.ayah} {ayahNumber}
        </h1>

        {loading && <p className="text-gray-500 mt-4">{t.loading}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        {!loading && !error && (
          <div className="space-y-3 leading-relaxed mt-4">
            {verses.map(v => (
              <p key={v.id} className="text-[#222]">
                <span className="font-semibold">{v.id}.</span> {v.text}
                {lang !== 'ar' && v.translation && (
                  <span className="block text-sm text-gray-600 mt-1">{v.translation}</span>
                )}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}