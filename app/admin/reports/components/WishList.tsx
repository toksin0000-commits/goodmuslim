'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import WishListView from './WishListView';

type Wish = {
  id: string;
  text: string;
  created_at: string;
  reports: number;
  is_hidden: boolean;
  language: string;
  ip_address: string;
  reportCount?: number;
};

export default function WishList() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
    loadWishes();

    const interval = setInterval(loadWishes, 5000);
    return () => clearInterval(interval);
  }, []);

  async function checkAdmin() {
    try {
      const res = await fetch('/api/admin/check', { credentials: 'include' });
      if (!res.ok) router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  }

  async function loadWishes() {
    setIsRefreshing(true);

    const { data: wishesData } = await supabase
      .from('goodmuslim_wishes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!wishesData) {
      setWishes([]);
      setLoading(false);
      setIsRefreshing(false);
      return;
    }

    const wishesWithReports = await Promise.all(
      wishesData.map(async (wish) => {
        const { count } = await supabase
          .from('goodmuslim_reports')
          .select('*', { count: 'exact', head: true })
          .eq('wish_id', wish.id);
        return { ...wish, reportCount: count || 0 };
      })
    );

    setWishes(wishesWithReports.sort((a, b) => 
      (b.reportCount || 0) - (a.reportCount || 0)
    ));
    setLoading(false);
    setIsRefreshing(false);
  }

  // ✅ PŘEPÍNÁNÍ VIDITELNOSTI (hide/unhide)
  async function toggleHideWish(id: string) {
    const wish = wishes.find(w => w.id === id);
    if (!wish) return;

    const newHiddenState = !wish.is_hidden;

    const { error } = await supabase
      .from('goodmuslim_wishes')
      .update({ is_hidden: newHiddenState })
      .eq('id', id);
    
    if (error) {
      console.error('❌ Chyba při změně viditelnosti:', error);
    } else {
      console.log(`✅ Přání ${newHiddenState ? 'skryto' : 'zobrazeno'}`);
    }
    
    loadWishes();
  }

  async function deleteWish(id: string) {
    if (!confirm('Opravdu smazat toto přání?')) return;
    
    await supabase.from('goodmuslim_reports').delete().eq('wish_id', id);
    await supabase.from('goodmuslim_wishes').delete().eq('id', id);
    loadWishes();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  if (loading) return <div className="p-6">Načítání...</div>;

  return (
    <WishListView
      wishes={wishes}
      onToggleHide={toggleHideWish}    // ✅ změněno z onHide na onToggleHide
      onDelete={deleteWish}
      onLogout={handleLogout}
      isRefreshing={isRefreshing}
    />
  );
}