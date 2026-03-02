"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Filtro from "@/components/Filtro";
import { getProducts, getCategories, Product, Category, ProductFilters } from "@/lib/api";

// Convierte el rango de precio del filtro visual → parámetros de la API
function parsePriceRange(range: string): { minPrice?: number; maxPrice?: number } {
  if (range === "0-300")   return { maxPrice: 300 };
  if (range === "300-500") return { minPrice: 300, maxPrice: 500 };
  if (range === "500+")    return { minPrice: 500 };
  return {};
}

function ProductSkeleton() {
  return (
    <div className="bg-gray-900 p-6 rounded-lg animate-pulse">
      <div className="h-40 bg-gray-800 rounded-md mb-4" />
      <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
      <div className="h-10 bg-gray-800 rounded" />
    </div>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();

  const [products, setProducts]           = useState<Product[]>([]);
  const [categories, setCategories]       = useState<Category[]>([]);
  const [total, setTotal]                 = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // Filtros — la categoría puede venir por query param (?category=anillos)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "Todos"
  );
  const [selectedPrice, setSelectedPrice] = useState("Todos");
  const [search, setSearch]               = useState("");
  const [page, setPage]                   = useState(1);

  // Cargar categorías una sola vez al montar
  useEffect(() => {
    getCategories()
      .then(({ categories }) => setCategories(categories))
      .catch(console.error);
  }, []);

  // Cargar productos cada vez que cambien los filtros o la página
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: ProductFilters = {
        page,
        limit: 9,
        ...(selectedCategory !== "Todos" && { category: selectedCategory }),
        ...(search && { search }),
        ...parsePriceRange(selectedPrice),
      };
      const data = await getProducts(filters);
      setProducts(data.products);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedPrice, search, page]);

  // Reset a página 1 cuando cambia cualquier filtro
  useEffect(() => { setPage(1); }, [selectedCategory, selectedPrice, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <main className="min-h-screen bg-black text-white px-10 py-16">
      <h1 className="text-4xl font-bold text-yellow-500 mb-2">
        Nuestro Catálogo
      </h1>
      <p className="text-gray-500 text-sm mb-10">
        {loading
          ? "Cargando..."
          : `${total} producto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
      </p>

      <div className="grid md:grid-cols-4 gap-10">

        {/* Filtro ahora recibe categorías reales + search */}
        <Filtro
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          search={search}
          setSearch={setSearch}
        />

        <div className="md:col-span-3">

          {/* Error con botón de reintento */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={fetchProducts}
                className="text-xs border border-red-500 px-3 py-1 rounded hover:bg-red-800 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Skeletons mientras carga */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>

          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">💎</span>
              <p className="text-gray-400 text-lg">No se encontraron productos</p>
              <p className="text-gray-600 text-sm mt-1">Intenta cambiar los filtros</p>
            </div>

          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginación — solo aparece si hay más de 9 productos */}
              {total > 9 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 rounded text-sm disabled:opacity-30 hover:border-yellow-500 transition"
                  >
                    ← Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-400">
                    Página {page} de {Math.ceil(total / 9)}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(total / 9)}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 rounded text-sm disabled:opacity-30 hover:border-yellow-500 transition"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
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