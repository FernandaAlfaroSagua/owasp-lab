'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, auth } from '@/lib/api';

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  // Re-evaluate on every navigation so the nav follows login and logout.
  useEffect(() => {
    setLoggedIn(auth.getToken() !== null);
  }, [pathname]);

  function logout() {
    api.logout();
    setLoggedIn(false);
    router.push('/login');
  }

  return (
    <nav className="nav">
      <strong>OWASP Lab Shop</strong>
      <Link href="/products">Products</Link>
      <Link href="/orders">My orders</Link>
      {loggedIn && <Link href="/profile">Profile</Link>}
      <span className="spacer" />
      {loggedIn ? (
        <button className="link" onClick={logout}>
          Log out
        </button>
      ) : (
        <Link href="/login">Log in</Link>
      )}
    </nav>
  );
}
