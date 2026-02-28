"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Filtro from "@/components/Filtro";

type Props = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedPrice: string;
  setSelectedPrice: (value: string) => void;
};

const products = [
  { id: 1, name: "Anillo de Oro", price: 350, category: "Anillos" },
  { id: 2, name: "Collar de Plata", price: 220, category: "Collares" },
  { id: 3, name: "Pulsera Platino", price: 480, category: "Pulseras" },
  { id: 4, name: "Aretes Diamante", price: 650, category: "Aretes" },
];

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPrice, setSelectedPrice] = useState("Todos");
  
  const filteredProducts = products.filter((p) => {
  const categoryMatch =
    selectedCategory === "Todos" || p.category === selectedCategory;

  const priceMatch =
    selectedPrice === "Todos" ||
    (selectedPrice === "0-300" && p.price <= 300) ||
    (selectedPrice === "300-500" && p.price > 300 && p.price <= 500) ||
    (selectedPrice === "500+" && p.price > 500);

  return categoryMatch && priceMatch;
});

  return (
    <main className="min-h-screen bg-black text-white px-10 py-16">
      <h1 className="text-4xl font-bold text-yellow-500 mb-10">
        Nuestro Catálogo
      </h1>

      <div className="grid md:grid-cols-4 gap-10">
        
        <Filtro
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
        />

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </main>
  );
}