'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code1, code2 })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">🕌 Good Muslim Admin</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code (3 letters)
            </label>
            <input
              type="text"
              value={code1}
              onChange={(e) => setCode1(e.target.value)}
              maxLength={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg uppercase"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code (3 numbers)
            </label>
            <input
              type="text"
              value={code2}
              onChange={(e) => setCode2(e.target.value)}
              maxLength={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#2d5a27] text-white rounded-lg hover:bg-[#1e3d1a] transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}