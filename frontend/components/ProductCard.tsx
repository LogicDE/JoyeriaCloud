"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price), // convertir string a number
      image: product.image_url || "",   // adaptar nombre de propiedad
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg hover:scale-105 transition duration-300 shadow-lg border border-gray-800 hover:border-yellow-500">

      <Link href={`/catalog/${product.id}`} className="block">
        <div>
          <div className="h-40 bg-gray-800 mb-4 rounded-md overflow-hidden flex items-center justify-center text-gray-500">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">💎</span>
            )}
          </div>

          <h2 className="text-xl font-semibold text-white">
            {product.name}
          </h2>

          <p className="text-yellow-500 text-lg font-bold mt-2">
            ${parseFloat(product.price).toLocaleString()}
          </p>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-400 transition disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
      </button>

    </div>
  );
}