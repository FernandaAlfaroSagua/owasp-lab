'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api, ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.login(email, password);
      router.push('/products');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    }
  }

  return (
    <div>
      <h1>Log in</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
