'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { api, Product } from '@/lib/api';

const CATEGORIES = ['electronics', 'office', 'books', 'kitchen'];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load(params: { search?: string; category?: string }) {
    try {
      setError(null);
      setProducts(await api.listProducts(params));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    }
  }

  useEffect(() => {
    load({});
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    load({ search, category });
  }

  return (
    <div>
      <h1>Products</h1>
      <form className="toolbar" onSubmit={onSubmit}>
        <input
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}
      {!error && products.length === 0 && <p className="muted">No products found.</p>}

      <div className="grid">
        {products.map((p) => (
          <article key={p.id} className="card">
            <span className="badge">{p.category}</span>
            <h3>
              <Link href={`/products/${p.id}`}>{p.name}</Link>
            </h3>
            <p className="muted">{p.description}</p>
            <strong>${p.price.toFixed(2)}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
