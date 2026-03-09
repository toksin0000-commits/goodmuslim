'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!res.ok) {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🕌 Admin Dashboard</h1>
        
        <div className="grid gap-4">
          <Link 
            href="/admin/reports" 
            className="block p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <div className="font-medium">📋 Wishes Management</div>
            <div className="text-sm text-gray-500 mt-1">
              View, hide and delete wishes
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}