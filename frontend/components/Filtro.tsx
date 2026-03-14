"use client";

import { Category } from "@/lib/api";

type Props = {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedPrice: string;
  setSelectedPrice: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
};

export default function Filtro({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  search,
  setSearch,
}: Props) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg h-fit space-y-6">
      <h2 className="text-yellow-500 text-xl font-semibold">Filtros</h2>

      {/* Búsqueda */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Buscar</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nombre, material..."
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-yellow-500 placeholder-gray-600"
        />
      </div>

      {/* Categorías — dinámicas desde el backend */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Categoría</p>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("Todos")}
            className={`block w-full text-left px-3 py-2 rounded-md transition ${
              selectedCategory === "Todos"
                ? "bg-yellow-500 text-black"
                : "text-white hover:bg-gray-800"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-md transition ${
                selectedCategory === cat.slug
                  ? "bg-yellow-500 text-black"
                  : "text-white hover:bg-gray-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Precio</p>
        <div className="space-y-1">
          {[
            { label: "Todos",        value: "Todos" },
            { label: "Hasta $300",   value: "0-300" },
            { label: "$300 – $500",  value: "300-500" },
            { label: "Más de $500",  value: "500+" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedPrice(r.value)}
              className={`block w-full text-left px-3 py-2 rounded-md transition ${
                selectedPrice === r.value
                  ? "bg-yellow-500 text-black"
                  : "text-white hover:bg-gray-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}