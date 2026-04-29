'use client';

import { useEffect, useState } from 'react';

// ========== TYPES ==========
export type Verse = { 
  id: number; 
  text: string; 
  translation?: string 
};

export type Surah = { 
  id: number; 
  name: string; 
  transliteration: string;
  translation: string;
  type: string;
  total_verses?: number;
  verses: Verse[] 
};

export type QuranData = Surah[];
export type Lang = 'ar' | 'en' | 'ur';

// ========== CACHE ==========
interface QuranCacheData { 
  data: QuranData; 
  timestamp: number 
}

const quranCache = new Map<string, QuranCacheData>();
const QURAN_CACHE_DURATION = 86400000; // cache duration

// ========== STATICKÁ DATA ==========
export const surahs = [
  { id: 1, name: "Al-Fatihah", name_ar: "الفاتحة", name_en: "The Opening", name_ur: "الفاتحہ", verses: 7 },
  { id: 2, name: "Al-Baqarah", name_ar: "البقرة", name_en: "The Cow", name_ur: "البقرہ", verses: 286 },
  { id: 3, name: "Aali Imran", name_ar: "آل عمران", name_en: "Family of Imran", name_ur: "آل عمران", verses: 200 },
  { id: 4, name: "An-Nisa", name_ar: "النساء", name_en: "The Women", name_ur: "النساء", verses: 176 },
  { id: 5, name: "Al-Ma'idah", name_ar: "المائدة", name_en: "The Table Spread", name_ur: "المائدہ", verses: 120 },
  { id: 6, name: "Al-An'am", name_ar: "الأنعام", name_en: "The Cattle", name_ur: "الأنعام", verses: 165 },
  { id: 7, name: "Al-A'raf", name_ar: "الأعراف", name_en: "The Heights", name_ur: "الأعراف", verses: 206 },
  { id: 8, name: "Al-Anfal", name_ar: "الأنفال", name_en: "The Spoils of War", name_ur: "الأنفال", verses: 75 },
  { id: 9, name: "At-Tawbah", name_ar: "التوبة", name_en: "The Repentance", name_ur: "التوبہ", verses: 129 },
  { id: 10, name: "Yunus", name_ar: "يونس", name_en: "Jonah", name_ur: "یونس", verses: 109 },
  { id: 11, name: "Hud", name_ar: "هود", name_en: "Hud", name_ur: "ہود", verses: 123 },
  { id: 12, name: "Yusuf", name_ar: "يوسف", name_en: "Joseph", name_ur: "یوسف", verses: 111 },
  { id: 13, name: "Ar-Ra'd", name_ar: "الرعد", name_en: "The Thunder", name_ur: "الرعد", verses: 43 },
  { id: 14, name: "Ibrahim", name_ar: "إبراهيم", name_en: "Abraham", name_ur: "ابراہیم", verses: 52 },
  { id: 15, name: "Al-Hijr", name_ar: "الحجر", name_en: "The Rocky Tract", name_ur: "الحجر", verses: 99 },
  { id: 16, name: "An-Nahl", name_ar: "النحل", name_en: "The Bee", name_ur: "النحل", verses: 128 },
  { id: 17, name: "Al-Isra", name_ar: "الإسراء", name_en: "The Night Journey", name_ur: "الإسراء", verses: 111 },
  { id: 18, name: "Al-Kahf", name_ar: "الكهف", name_en: "The Cave", name_ur: "الکہف", verses: 110 },
  { id: 19, name: "Maryam", name_ar: "مريم", name_en: "Mary", name_ur: "مریم", verses: 98 },
  { id: 20, name: "Ta-Ha", name_ar: "طه", name_en: "Ta-Ha", name_ur: "طٰہٰ", verses: 135 },
  { id: 21, name: "Al-Anbiya", name_ar: "الأنبياء", name_en: "The Prophets", name_ur: "الأنبیاء", verses: 112 },
  { id: 22, name: "Al-Hajj", name_ar: "الحج", name_en: "The Pilgrimage", name_ur: "الحج", verses: 78 },
  { id: 23, name: "Al-Mu'minun", name_ar: "المؤمنون", name_en: "The Believers", name_ur: "المؤمنون", verses: 118 },
  { id: 24, name: "An-Nur", name_ar: "النور", name_en: "The Light", name_ur: "النور", verses: 64 },
  { id: 25, name: "Al-Furqan", name_ar: "الفرقان", name_en: "The Criterion", name_ur: "الفرقان", verses: 77 },
  { id: 26, name: "Ash-Shu'ara", name_ar: "الشعراء", name_en: "The Poets", name_ur: "الشعراء", verses: 227 },
  { id: 27, name: "An-Naml", name_ar: "النمل", name_en: "The Ant", name_ur: "النمل", verses: 93 },
  { id: 28, name: "Al-Qasas", name_ar: "القصص", name_en: "The Stories", name_ur: "القصص", verses: 88 },
  { id: 29, name: "Al-Ankabut", name_ar: "العنكبوت", name_en: "The Spider", name_ur: "العنکبوت", verses: 69 },
  { id: 30, name: "Ar-Rum", name_ar: "الروم", name_en: "The Romans", name_ur: "الروم", verses: 60 },
  { id: 31, name: "Luqman", name_ar: "لقمان", name_en: "Luqman", name_ur: "لقمان", verses: 34 },
  { id: 32, name: "As-Sajdah", name_ar: "السجدة", name_en: "The Prostration", name_ur: "السجدہ", verses: 30 },
  { id: 33, name: "Al-Ahzab", name_ar: "الأحزاب", name_en: "The Combined Forces", name_ur: "الأحزاب", verses: 73 },
  { id: 34, name: "Saba", name_ar: "سبإ", name_en: "Sheba", name_ur: "سبا", verses: 54 },
  { id: 35, name: "Fatir", name_ar: "فاطر", name_en: "The Originator", name_ur: "فاطر", verses: 45 },
  { id: 36, name: "Ya-Sin", name_ar: "يس", name_en: "Ya Sin", name_ur: "یٰس", verses: 83 },
  { id: 37, name: "As-Saffat", name_ar: "الصافات", name_en: "Those Who Set The Ranks", name_ur: "الصافات", verses: 182 },
  { id: 38, name: "Sad", name_ar: "ص", name_en: "Sad", name_ur: "ص", verses: 88 },
  { id: 39, name: "Az-Zumar", name_ar: "الزمر", name_en: "The Groups", name_ur: "الزمر", verses: 75 },
  { id: 40, name: "Ghafir", name_ar: "غافر", name_en: "The Forgiver", name_ur: "غافر", verses: 85 },
  { id: 41, name: "Fussilat", name_ar: "فصلت", name_en: "Explained in Detail", name_ur: "حم السجدہ", verses: 54 },
  { id: 42, name: "Ash-Shura", name_ar: "الشورى", name_en: "The Consultation", name_ur: "الشورى", verses: 53 },
  { id: 43, name: "Az-Zukhruf", name_ar: "الزخرف", name_en: "The Gold Adornments", name_ur: "الزخرف", verses: 89 },
  { id: 44, name: "Ad-Dukhan", name_ar: "الدخان", name_en: "The Smoke", name_ur: "الدخان", verses: 59 },
  { id: 45, name: "Al-Jathiyah", name_ar: "الجاثية", name_en: "The Crouching", name_ur: "الجاثیہ", verses: 37 },
  { id: 46, name: "Al-Ahqaf", name_ar: "الأحقاف", name_en: "The Wind-Curved Sandhills", name_ur: "الأحقاف", verses: 35 },
  { id: 47, name: "Muhammad", name_ar: "محمد", name_en: "Muhammad", name_ur: "محمد", verses: 38 },
  { id: 48, name: "Al-Fath", name_ar: "الفتح", name_en: "The Victory", name_ur: "الفتح", verses: 29 },
  { id: 49, name: "Al-Hujurat", name_ar: "الحجرات", name_en: "The Rooms", name_ur: "الحجرات", verses: 18 },
  { id: 50, name: "Qaf", name_ar: "ق", name_en: "Qaf", name_ur: "ق", verses: 45 },
  { id: 51, name: "Adh-Dhariyat", name_ar: "الذاريات", name_en: "The Winnowing Winds", name_ur: "الذاریات", verses: 60 },
  { id: 52, name: "At-Tur", name_ar: "الطور", name_en: "The Mount", name_ur: "الطور", verses: 49 },
  { id: 53, name: "An-Najm", name_ar: "النجم", name_en: "The Star", name_ur: "النجم", verses: 62 },
  { id: 54, name: "Al-Qamar", name_ar: "القمر", name_en: "The Moon", name_ur: "القمر", verses: 55 },
  { id: 55, name: "Ar-Rahman", name_ar: "الرحمن", name_en: "The Beneficent", name_ur: "الرحمن", verses: 78 },
  { id: 56, name: "Al-Waqi'ah", name_ar: "الواقعة", name_en: "The Inevitable", name_ur: "الواقعہ", verses: 96 },
  { id: 57, name: "Al-Hadid", name_ar: "الحديد", name_en: "The Iron", name_ur: "الحدید", verses: 29 },
  { id: 58, name: "Al-Mujadilah", name_ar: "المجادلة", name_en: "The Pleading Woman", name_ur: "المجادلہ", verses: 22 },
  { id: 59, name: "Al-Hashr", name_ar: "الحشر", name_en: "The Exile", name_ur: "الحشر", verses: 24 },
  { id: 60, name: "Al-Mumtahanah", name_ar: "الممتحنة", name_en: "She That Is To Be Examined", name_ur: "الممتحنہ", verses: 13 },
  { id: 61, name: "As-Saff", name_ar: "الصف", name_en: "The Ranks", name_ur: "الصف", verses: 14 },
  { id: 62, name: "Al-Jumu'ah", name_ar: "الجمعة", name_en: "The Congregation, Friday", name_ur: "الجمعہ", verses: 11 },
  { id: 63, name: "Al-Munafiqun", name_ar: "المنافقون", name_en: "The Hypocrites", name_ur: "المنافقون", verses: 11 },
  { id: 64, name: "At-Taghabun", name_ar: "التغابن", name_en: "The Mutual Disillusion", name_ur: "التغابن", verses: 18 },
  { id: 65, name: "At-Talaq", name_ar: "الطلاق", name_en: "The Divorce", name_ur: "الطلاق", verses: 12 },
  { id: 66, name: "At-Tahrim", name_ar: "التحريم", name_en: "The Prohibition", name_ur: "التحریم", verses: 12 },
  { id: 67, name: "Al-Mulk", name_ar: "الملك", name_en: "The Sovereignty", name_ur: "الملک", verses: 30 },
  { id: 68, name: "Al-Qalam", name_ar: "القلم", name_en: "The Pen", name_ur: "القلم", verses: 52 },
  { id: 69, name: "Al-Haqqah", name_ar: "الحاقة", name_en: "The Reality", name_ur: "الحاقہ", verses: 52 },
  { id: 70, name: "Al-Ma'arij", name_ar: "المعارج", name_en: "The Ascending Stairways", name_ur: "المعارج", verses: 44 },
  { id: 71, name: "Nuh", name_ar: "نوح", name_en: "Noah", name_ur: "نوح", verses: 28 },
  { id: 72, name: "Al-Jinn", name_ar: "الجن", name_en: "The Jinn", name_ur: "الجن", verses: 28 },
  { id: 73, name: "Al-Muzzammil", name_ar: "المزمل", name_en: "The Enshrouded One", name_ur: "المزمل", verses: 20 },
  { id: 74, name: "Al-Muddaththir", name_ar: "المدثر", name_en: "The Cloaked One", name_ur: "المدثر", verses: 56 },
  { id: 75, name: "Al-Qiyamah", name_ar: "القيامة", name_en: "The Resurrection", name_ur: "القیامہ", verses: 40 },
  { id: 76, name: "Al-Insan", name_ar: "الإنسان", name_en: "The Man", name_ur: "الإنسان", verses: 31 },
  { id: 77, name: "Al-Mursalat", name_ar: "المرسلات", name_en: "The Emissaries", name_ur: "المرسلات", verses: 50 },
  { id: 78, name: "An-Naba", name_ar: "النبإ", name_en: "The Great News", name_ur: "النبأ", verses: 40 },
  { id: 79, name: "An-Nazi'at", name_ar: "النازعات", name_en: "Those Who Drag Forth", name_ur: "النازعات", verses: 46 },
  { id: 80, name: "Abasa", name_ar: "عبس", name_en: "He Frowned", name_ur: "عبس", verses: 42 },
  { id: 81, name: "At-Takwir", name_ar: "التكوير", name_en: "The Overthrowing", name_ur: "التکویر", verses: 29 },
  { id: 82, name: "Al-Infitar", name_ar: "الإنفطار", name_en: "The Cleaving", name_ur: "الإنفطار", verses: 19 },
  { id: 83, name: "Al-Mutaffifin", name_ar: "المطففين", name_en: "The Defrauding", name_ur: "المطففین", verses: 36 },
  { id: 84, name: "Al-Inshiqaq", name_ar: "الإنشقاق", name_en: "The Sundering", name_ur: "الإنشقاق", verses: 25 },
  { id: 85, name: "Al-Buruj", name_ar: "البروج", name_en: "The Mansions of the Stars", name_ur: "البروج", verses: 22 },
  { id: 86, name: "At-Tariq", name_ar: "الطارق", name_en: "The Nightcommer", name_ur: "الطارق", verses: 17 },
  { id: 87, name: "Al-A'la", name_ar: "الأعلى", name_en: "The Most High", name_ur: "الأعلى", verses: 19 },
  { id: 88, name: "Al-Ghashiyah", name_ar: "الغاشية", name_en: "The Overwhelming", name_ur: "الغاشیہ", verses: 26 },
  { id: 89, name: "Al-Fajr", name_ar: "الفجر", name_en: "The Dawn", name_ur: "الفجر", verses: 30 },
  { id: 90, name: "Al-Balad", name_ar: "البلد", name_en: "The City", name_ur: "البلد", verses: 20 },
  { id: 91, name: "Ash-Shams", name_ar: "الشمس", name_en: "The Sun", name_ur: "الشمس", verses: 15 },
  { id: 92, name: "Al-Layl", name_ar: "الليل", name_en: "The Night", name_ur: "اللیل", verses: 21 },
  { id: 93, name: "Ad-Duha", name_ar: "الضحى", name_en: "The Morning Hours", name_ur: "الضحى", verses: 11 },
  { id: 94, name: "Ash-Sharh", name_ar: "الشرح", name_en: "The Relief", name_ur: "الشرح", verses: 8 },
  { id: 95, name: "At-Tin", name_ar: "التين", name_en: "The Fig", name_ur: "التین", verses: 8 },
  { id: 96, name: "Al-Alaq", name_ar: "العلق", name_en: "The Clot", name_ur: "العلق", verses: 19 },
  { id: 97, name: "Al-Qadr", name_ar: "القدر", name_en: "The Power, Fate", name_ur: "القدر", verses: 5 },
  { id: 98, name: "Al-Bayyinah", name_ar: "البينة", name_en: "The Clear Proof", name_ur: "البینہ", verses: 8 },
  { id: 99, name: "Az-Zalzalah", name_ar: "الزلزلة", name_en: "The Earthquake", name_ur: "الزلزلہ", verses: 8 },
  { id: 100, name: "Al-Adiyat", name_ar: "العاديات", name_en: "The Chargers", name_ur: "العادیات", verses: 11 },
  { id: 101, name: "Al-Qari'ah", name_ar: "القارعة", name_en: "The Calamity", name_ur: "القارعہ", verses: 11 },
  { id: 102, name: "At-Takathur", name_ar: "التكاثر", name_en: "The Rivalry in World Increase", name_ur: "التکاثر", verses: 8 },
  { id: 103, name: "Al-Asr", name_ar: "العصر", name_en: "The Declining Day", name_ur: "العصر", verses: 3 },
  { id: 104, name: "Al-Humazah", name_ar: "الهمزة", name_en: "The Traducer", name_ur: "الہمزہ", verses: 9 },
  { id: 105, name: "Al-Fil", name_ar: "الفيل", name_en: "The Elephant", name_ur: "الفیل", verses: 5 },
  { id: 106, name: "Quraysh", name_ar: "قريش", name_en: "Quraysh", name_ur: "قریش", verses: 4 },
  { id: 107, name: "Al-Ma'un", name_ar: "الماعون", name_en: "The Small Kindnesses", name_ur: "الماعون", verses: 7 },
  { id: 108, name: "Al-Kawthar", name_ar: "الكوثر", name_en: "The Abundance", name_ur: "الکوثر", verses: 3 },
  { id: 109, name: "Al-Kafirun", name_ar: "الكافرون", name_en: "The Disbelievers", name_ur: "الکافرون", verses: 6 },
  { id: 110, name: "An-Nasr", name_ar: "النصر", name_en: "The Divine Support", name_ur: "النصر", verses: 3 },
  { id: 111, name: "Al-Masad", name_ar: "المسد", name_en: "The Palm Fiber", name_ur: "المسد", verses: 5 },
  { id: 112, name: "Al-Ikhlas", name_ar: "الإخلاص", name_en: "The Sincerity", name_ur: "الإخلاص", verses: 4 },
  { id: 113, name: "Al-Falaq", name_ar: "الفلق", name_en: "The Daybreak", name_ur: "الفلق", verses: 5 },
  { id: 114, name: "An-Nas", name_ar: "الناس", name_en: "The Mankind", name_ur: "الناس", verses: 6 },
];


export const translations = {
  ar: { 
    title: "القرآن",
    surah: "سورة",
    ayah: "آية",
    allAyahs: "جميع الآيات",        // 🔥 přidáno
    loading: "جاري التحميل...",
    error: "فشل تحميل القرآن",
    home: "الرئيسية",
    search: "بحث"
  },
  en: { 
    title: "Qur'an",
    surah: "Surah",
    ayah: "Ayah",
    allAyahs: "All verses",         // 🔥 přidáno
    loading: "Loading...",
    error: "Failed to load Qur'an",
    home: "Home",
    search: "Search"
  },
  ur: { 
    title: "قرآن",
    surah: "سورہ",
    ayah: "آیت",
    allAyahs: "تمام آیات",          // 🔥 přidáno
    loading: "لوڈ ہو رہا ہے...",
    error: "قرآن لوڈ نہیں ہو سکا",
    home: "مرکزی صفحہ",
    search: "تلاش"
  },
};


// ========== HOOK ==========
export const useQuran = (lang: Lang) => {
  const [surahId, setSurahId] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[lang];

  const getSurahName = (id: number) => {
    const surah = surahs.find(s => s.id === id);
    if (!surah) return `Surah ${id}`;
    if (lang === 'ar') return surah.name_ar;
    if (lang === 'ur') return surah.name_ur;
    return surah.name_en;
  };

  useEffect(() => {
    async function loadQuran() {
      setLoading(true);
      setError(null);

      const cacheKey = `quran_${lang}`;
      const cached = quranCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < QURAN_CACHE_DURATION) {
        const surahData = cached.data.find((s: Surah) => s.id === surahId);
        if (surahData) setVerses(surahData.verses || []);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/data/quran_${lang}.json`);
        if (!res.ok) throw new Error('Načtení selhalo');

        const quranData: QuranData = await res.json();
        quranCache.set(cacheKey, { data: quranData, timestamp: Date.now() });

        const surahData = quranData.find((s: Surah) => s.id === surahId);
        if (surahData) setVerses(surahData.verses || []);
      } catch (err) {
        console.error('Chyba načtení Koránu:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    }

    loadQuran();
  }, [lang, surahId, ayahNumber]); // 🔥 přidáno ayahNumber

  const currentSurah = surahs.find(s => s.id === surahId);
  const currentVerse = verses.find(v => v.id === ayahNumber) || null;

  return { 
    surahId, 
    ayahNumber, 
    verses, 
    verse: currentVerse,   // 🔥 jeden verš
    loading, 
    error, 
    t, 
    currentSurah, 
    setSurahId, 
    setAyahNumber, 
    getSurahName 
  };
};
