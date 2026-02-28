"use client";

import Link from "next/link";
import { useCart } from "@/context/Cartcontext";

export default function Navbar() {
  const cartContext = useCart();

  if (!cartContext) {
    return null;
  }

  const { cart } = cartContext;

  return (
    <nav className="bg-black text-white px-10 py-4 flex justify-between items-center shadow-lg">
      
      <Link href="/" className="text-2xl font-bold text-yellow-500">
        JoyeriaCloud
      </Link>

      <div className="flex items-center gap-8">
        <Link href="/" className="hover:text-yellow-500 transition">
          Inicio
        </Link>

        <Link href="/catalog" className="hover:text-yellow-500 transition">
          Catálogo
        </Link>

        <Link href="/cart" className="relative hover:text-yellow-500 transition">
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}