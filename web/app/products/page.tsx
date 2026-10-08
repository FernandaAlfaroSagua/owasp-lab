'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { api, Product } from '@/lib/api';

const CATEGORIES = ['electronics', 'office', 'books', 'kitchen'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'category', label: 'Category' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name');
  const [dir, setDir] = useState('asc');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load(params: { search?: string; category?: string; sort?: string; dir?: string }) {
    try {
      setError(null);
      setProducts(await api.listProducts(params));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    }
  }

  useEffect(() => {
    load({ sort, dir });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    load({ search, category, sort, dir });
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
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort by {o.label}
            </option>
          ))}
        </select>
        <select value={dir} onChange={(e) => setDir(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
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
