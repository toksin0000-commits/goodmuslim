'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Wish = {
  id: string;
  text: string;
  created_at: string;
  reports?: number;
  is_hidden?: boolean;
};

// 📚 VLASTNÍ KNIHOVNA PRO FILTRACI SPROSTÝCH SLOV
const badWords = [
  // Anglická
  'fuck', 'shit', 'damn', 'cunt', 'asshole', 'bastard', 'bitch', 'dick', 'piss',
  'fucking', 'motherfucker', 'pussy', 'whore', 'slut',
  
  // Česká (pro jistotu, ale už se nepoužívá)
  'kurva', 'pica', 'píča', 'kokot', 'čurák', 'debil', 'kretén', 'zmrd', 'hajzl',
  'mrdat', 'sracka', 'sračka', 'posera', 'zjebany', 'zjebaný', 'zjebat', 'do pice',
  'do piče', 'do prdele', 'do hajzlu', 'do hajzla', 'kundo', 'kunda',
];

const containsBadWords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return badWords.some(word => lowerText.includes(word));
};

export const useWishes = (dict: any, lang: string) => {
  const [text, setText] = useState('');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [canPost, setCanPost] = useState(true);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  // Získání IP adresy
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(err => console.error('Chyba při získávání IP:', err));
  }, []);

  // Kontrola denního limitu
  useEffect(() => {
    if (!ipAddress) return;

    async function checkDailyLimit() {
      try {
        const response = await fetch('/api/check-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: ipAddress, lang })
        });
        const data = await response.json();
        setCanPost(data.canPost);
      } catch (err) {
        console.error('Chyba při kontrole limitu:', err);
      }
    }
    checkDailyLimit();
  }, [ipAddress, lang]);

  // 🔥 Načtení přání - S CHYTROU DETEKCÍ ZMĚN (podle první appky)
  const loadWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('goodmuslim_wishes')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false }) // true = nejstarší první (můžeš změnit)
        .limit(50);

      if (error) throw error;
      if (!data) return;

      // 🔥 Chytrá detekce - porovnání jestli se data změnila
      const same =
        wishes.length === data.length &&
        wishes.every((w, i) => w.id === data[i].id);

      if (!same) {
        setWishes(data);  // Aktualizujeme jen když je změna
      }

    } catch (err) {
      console.error('Chyba při načítání:', err);
      setFetchError(dict.load_error || 'Nepodařilo se načíst přání');
    }
  };

  // Automatický refresh
  useEffect(() => {
    loadWishes();
    const interval = setInterval(loadWishes, 5000);
    return () => clearInterval(interval);
  }, []);

  // NAHLÁŠENÍ PŘÁNÍ
  const handleReport = async (wishId: string) => {
    if (!confirm(dict.report_confirm)) return;

    setReportingId(wishId);

    try {
      const { error: reportError } = await supabase
        .from('goodmuslim_reports')
        .insert({ 
          wish_id: wishId,
          reported_by: ipAddress || 'unknown'
        });

      if (reportError) {
        if (reportError.code === '23505') {
          alert(dict.already_reported || 'Toto přání jste již nahlásili.');
          return;
        }
        throw reportError;
      }
      
      alert(dict.report_success);
      loadWishes();
    } catch (err) {
      console.error('Chyba při nahlašování:', err);
      alert(dict.report_failed);
    } finally {
      setReportingId(null);
    }
  };

  // Odeslání nového přání
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      console.log('🤖 Bot detected');
      return;
    }

    if (!text.trim() || !canPost) return;
    if (!ipAddress) {
      alert(dict.ip_error || 'Nepodařilo se ověřit IP adresu. Zkus to znovu.');
      return;
    }

    if (containsBadWords(text)) {
      alert(dict.bad_words);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('goodmuslim_wishes')
        .insert({ 
          text: text.trim(),
          language: lang,
          ip_address: ipAddress
        });

      if (error) throw error;

      setText('');
      setSubmitted(true);
      setCanPost(false);
      await loadWishes();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Chyba při odesílání:', err);
      alert(dict.submit_error || 'Nepodařilo se odeslat přání. Zkus to znovu.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    wishes,
    loading,
    error: fetchError,
    canPost,
    text,
    submitted,
    reportingId,
    honeypot,
    setText,
    setHoneypot,
    handleSubmit,
    handleReport,
    formatDate
  };
};