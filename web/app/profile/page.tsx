'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError, Profile } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .getMe()
      .then((p) => {
        setProfile(p);
        setName(p.name);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/login');
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      });
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      const updated = await api.updateMe(name);
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update profile');
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p className="muted">Loading...</p>;

  return (
    <div>
      <h1>My profile</h1>
      <p className="muted">
        {profile.email} &middot; {profile.role}
      </p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Display name
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
        </label>
        {saved && <p className="muted">Saved.</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
