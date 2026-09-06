'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AdminLogin() {
  const [email, setEmail] = useState('admin@malayalimed.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const { data, errors } = await res.json();
      if (!res.ok || errors?.length) {
        setError(errors?.[0] === 'invalid_credentials' ? 'Invalid email or password' : errors?.[0] || 'Login failed');
        setLoading(false);
        return;
      }
      // Wait 500ms for cookie to be set, then verify session before redirecting
      setTimeout(async () => {
        try {
          const sessionRes = await fetch('/api/admin/auth/me');
          if (sessionRes.ok) {
            router.push('/admin/dashboard');
          } else {
            setError('Session verification failed');
            setLoading(false);
          }
        } catch (err) {
          router.push('/admin/dashboard'); // Fallback redirect anyway
        }
      }, 500);
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-brand text-white py-2 rounded-lg font-medium hover:bg-brand/90 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
