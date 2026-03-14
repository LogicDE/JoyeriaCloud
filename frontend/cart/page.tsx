"use client";

import Link from "next/link";
import { useCart } from "@/context/Cartcontext";
import { Product as APIProduct } from "@/lib/api";


type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export default function ProductCard({ product }: { product: APIProduct }) {

  const { addToCart } = useCart();

  return (
    <div className="bg-gray-900 p-6 rounded-lg hover:scale-105 transition duration-300 shadow-lg">
      
      {/* Parte clickeable para navegar */}
      <Link href={`/catalog/${product.id}`} className="block">
        <div>
          <div className="h-40 bg-gray-800 mb-4 rounded-md flex items-center justify-center text-gray-500">
            Imagen
          </div>

          <h2 className="text-xl font-semibold text-white">
            {product.name}
          </h2>

          <p className="text-yellow-500 text-lg font-bold mt-2">
            ${product.price}
          </p>
        </div>
      </Link>

      {/* Botón independiente */}
      <button
        onClick={() => addToCart(product)}
        className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-400 transition"
      >
        Agregar al carrito
      </button>

    </div>
  );
}