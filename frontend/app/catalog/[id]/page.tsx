"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById, Product } from "@/lib/api";

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then(({ product }) => setProduct(product))
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      Cargando...
    </main>
  );

  if (!product) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      Producto no encontrado
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white px-10 py-16">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="h-80 rounded-lg overflow-hidden bg-zinc-800">
          <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">{product.name}</h1>
          <p className="text-gray-300 mb-6">{product.description}</p>
          <p className="text-2xl font-bold text-white mb-6">${product.price}</p>
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-md hover:bg-yellow-400 transition">
            Agregar al carrito
          </button>
        </div>
      </div>
    </main>
  );
}