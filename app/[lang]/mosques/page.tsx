// app/[lang]/mosques/page.tsx
"use client";

import Link from "next/link";
import { use } from "react";
import { useMosques } from './useMosques';
import { Lang } from './mosque.types';

// Překlady pro mešity
const translations = {
  ar: {
    title: "المساجد القريبة",
    findNearby: "البحث عن مساجد قريبة",
    finding: "جاري البحث عن المساجد...",
    distance: "المسافة",
    home: "الرئيسية",
    km: "كم",
    noMosques: "لا توجد مساجد قريبة",
    error: "فشل تحميل المساجد",
    denomination: "المذهب",
    address: "العنوان",
    nearbyMosque: "مسجد قريب",
    searching: "جاري البحث عن مساجد بالقرب منك...",
    notFound: "لم يتم العثور على مساجد قريبة.",
    cooldownMessage: "الرجاء الانتظار قبل البحث مرة أخرى",
    refresh: "تحديث الموقع"
  },
  en: {
    title: "Mosques Nearby",
    findNearby: "Find Mosques Near Me",
    finding: "Finding mosques...",
    distance: "Distance",
    home: "Home",
    km: "km",
    noMosques: "No mosques nearby",
    error: "Failed to load mosques",
    denomination: "Denomination",
    address: "Address",
    nearbyMosque: "Nearby mosque",
    searching: "Searching for mosques near you...",
    notFound: "No mosques found nearby.",
    cooldownMessage: "Please wait before searching again",
    refresh: "Refresh location"
  },
  ur: {
    title: "قریبی مساجد",
    findNearby: "قریبی مساجد تلاش کریں",
    finding: "مساجد تلاش ہو رہی ہیں...",
    distance: "فاصلہ",
    home: "مرکزی صفحہ",
    km: "کلومیٹر",
    noMosques: "آس پاس کوئی مسجد نہیں",
    error: "مساجد لوڈ کرنے میں ناکامی",
    denomination: "مسلک",
    address: "پتہ",
    nearbyMosque: "آس پاس کی مسجد",
    searching: "آپ کے آس پاس مساجد تلاش کر رہا ہے...",
    notFound: "آس پاس کوئی مسجد نہیں ملی۔",
    cooldownMessage: "براہ کرم اگلی تلاش سے پہلے انتظار کریں",
    refresh: "مقام کی تجدید کریں"
  }
};

export default function MosquesPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = use(params);
  const t = translations[lang];
  
  const {
    userLocation,
    nearbyMosques,
    loading,
    error,
    cooldown,
    notFound,
    handleFindNearby,
    clearCacheForLocation
  } = useMosques(lang, t);

  return (
    <div className="flex-1 flex flex-col px-6 pb-6 text-[#222]" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 left-4" style={{ left: '1rem', right: 'auto' }}>
        <Link href={`/${lang}`} className="text-sm text-[#222] hover:underline bg-white/70 px-3 py-1 rounded-full shadow-sm shadow-black/50 inline-flex items-center justify-center h-9.5">
          {lang === 'ur' ? '→' : '←'} {t.home}
        </Link>
      </div>

      <div className="mt-25">
        <h1 className="text-lg font-medium text-center text-[#222]">{t.title}</h1>
        
        <button
          onClick={handleFindNearby}
          disabled={loading || cooldown}
          className="mt-4 w-full py-3 px-4 bg-[#2d5a27] text-[#f7f5f2] rounded-xl border border-white shadow-sm shadow-black/50 font-medium hover:bg-opacity-80 transition disabled:opacity-50"
        >
          {loading ? t.finding : (cooldown ? '⏳' : t.findNearby)}
        </button>

        {/* Tlačítko pro obnovení - zobrazí se jen když je poloha známá */}
        {userLocation && (
          <button
            onClick={() => {
              clearCacheForLocation(userLocation.lat, userLocation.lng);
              handleFindNearby();
            }}
            className="mt-2 w-full py-2 px-3 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition border border-white shadow-sm shadow-black/50"
          >
            🔄 {t.refresh}
          </button>
        )}

        {/* Stav: Probíhá hledání */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="animate-pulse text-[#2d5a27] text-2xl">⏳</div>
            <p className="text-sm text-gray-600 mt-2">{t.searching}</p>
          </div>
        )}

        {/* Stav: Před prvním hledáním */}
{!userLocation && !loading && !error && !notFound && nearbyMosques.length === 0 && (
  <div className="flex flex-col items-center justify-center mt-16">
    <img 
      src="/images/mosque-icon.png"  // ← cesta k tvému obrázku
      alt="Mosque" 
      className="w-84 h-84 object-contain"  // ← uprav velikost podle potřeby
    />
    <p className="text-sm text-gray-600 mt-4 font-medium">
      {lang === 'ar' ? ' ابحث عن المساجد القريبة' :
       lang === 'ur' ? ' اپنے آس پاس مساجد تلاش کریں' :
       ' Find mosques near you'}
    </p>
  </div>
)}

        {/* Stav: Chyba */}
        {error && !loading && (
          <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Stav: Nic nenalezeno */}
        {notFound && !loading && !error && (
          <p className="mt-2 text-sm text-amber-600 text-center">{t.notFound}</p>
        )}

        {/* Stav: Nalezené mešity */}
        {!loading && !error && !notFound && nearbyMosques.length > 0 && (
          <div className="flex flex-col gap-4 mt-6">
            {nearbyMosques.map((mosque, index) => (
              <div key={`${mosque.name}-${index}`} className="rounded-xl px-4 py-3 text-sm bg-[#f7f5f2] text-[#222] shadow-inner shadow-amber-900/10">
                <h2 className="font-medium text-[#222]">{mosque.name}</h2>
                {mosque.denomination && (
                  <p className="text-xs text-gray-600 mt-0.5">{t.denomination}: {mosque.denomination}</p>
                )}
                <p className="text-sm text-[#222] mt-1">{mosque.address}</p>
                <p className="text-xs text-gray-600 mt-2">{t.distance}: {mosque.distance.toFixed(1)} {t.km}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}