'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, Product } from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load product'));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="muted">Loading...</p>;

  return (
    <div>
      <p>
        <Link href="/products">Back to products</Link>
      </p>
      <article className="card">
        <span className="badge">{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong>${product.price.toFixed(2)}</strong>
      </article>
    </div>
  );
}
