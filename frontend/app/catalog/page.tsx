"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories, Product, Category, ProductFilters } from "@/lib/api";
import Link from "next/link";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    getCategories()
      .then(({ categories }) => setCategories(categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(filters)
      .then(({ products }) => setProducts(products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-12">
      <h1 className="text-4xl font-bold text-yellow-500 mb-8">Catálogo</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <select
          className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 text-sm"
          onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar..."
          className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 text-sm"
          onChange={(e) => setFilters(f => ({ ...f, search: e.target.value || undefined }))}
        />
      </div>

      {/* Productos */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-zinc-400">Cargando...</div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-zinc-400">No se encontraron productos.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link href={`/catalog/${product.id}`} key={product.id}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-500 transition cursor-pointer">
                <div className="h-48 bg-zinc-800 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-yellow-500 mb-1">{product.category?.name}</p>
                  <h2 className="font-semibold text-white mb-2 truncate">{product.name}</h2>
                  <p className="text-yellow-400 font-bold">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

// Suspense requerido por useSearchParams en Next.js 14+
export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}