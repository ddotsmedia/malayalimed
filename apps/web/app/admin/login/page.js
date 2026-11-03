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
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const { data, errors } = await res.json();
    if (!res.ok || errors?.length) {
      setError(errors?.[0] === 'invalid_credentials' ? 'Invalid email or password' : 'Login failed');
      setLoading(false);
      return;
    }
    router.push('/admin/dashboard');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-3 py-2 border rounded" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-3 py-2 border rounded" />
          {error && <div className="text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-brand text-white py-2 rounded">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
