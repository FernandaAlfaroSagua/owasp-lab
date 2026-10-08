'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ApiError, Order } from '@/lib/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listOrders()
      .then(setOrders)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/login');
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      });
  }, [router]);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="muted">Loading...</p>;

  return (
    <div>
      <h1>My orders</h1>
      {orders.length === 0 ? (
        <p className="muted">You have no orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link href={`/orders/${o.id}`}>{o.id.slice(0, 8)}</Link>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className="badge">{o.status}</span>
                </td>
                <td>${o.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
