"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories, Product, Category, ProductFilters } from "@/lib/api";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

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
    <main className="min-h-screen bg-surface-base text-foreground px-6 lg:px-10 py-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light tracking-wide drop-shadow-sm">Nuestro Catálogo</h1>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/60 group-focus-within:text-gold-light transition-colors">
                <SlidersHorizontal size={18} />
              </div>
              <select
                className="w-full appearance-none bg-surface-elevated border border-surface-border text-foreground rounded-sm pl-10 pr-8 py-2.5 text-sm outline-none focus:border-gold-mid/50 focus:ring-1 focus:ring-gold-mid/30 transition-all cursor-pointer font-sans"
                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
                aria-label="Filtrar por categoría"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="relative group flex-grow md:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/60 group-focus-within:text-gold-light transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Buscar joyas..."
                className="w-full bg-surface-elevated border border-surface-border text-foreground rounded-sm pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gold-mid/50 focus:ring-1 focus:ring-gold-mid/30 transition-all font-sans placeholder:text-foreground/40"
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value || undefined }))}
                aria-label="Buscar productos"
              />
            </div>
          </div>
        </div>

        {/* Productos */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gold-mid animate-pulse text-lg tracking-wider">Cargando colección...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-foreground/50 glass rounded-xl p-10">
            <p className="text-xl font-light mb-2">No se encontraron piezas.</p>
            <p className="text-sm">Intenta ajustar tu búsqueda o filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}