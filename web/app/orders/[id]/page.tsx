'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ApiError, Order } from '@/lib/api';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getOrder(id)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/login');
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load order');
      });
  }, [id, router]);

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="muted">Loading...</p>;

  return (
    <div>
      <p>
        <Link href="/orders">Back to orders</Link>
      </p>
      <h1>Order {order.id.slice(0, 8)}</h1>
      <p>
        <span className="badge">{order.status}</span>{' '}
        <span className="muted">{new Date(order.createdAt).toLocaleString()}</span>
      </p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.productId}>
              <td>
                <Link href={`/products/${i.productId}`}>{i.name}</Link>
              </td>
              <td>{i.quantity}</td>
              <td>${i.unitPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Total: ${order.total.toFixed(2)}</strong>
      </p>
    </div>
  );
}
