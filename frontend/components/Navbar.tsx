"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const { getTotalItems } = useCartStore();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = getTotalItems();

  return (
    <>
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

          {user ? (
            <>
              <Link href="/profile" className="hover:text-yellow-500 transition text-sm">
                👤 {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-zinc-400 hover:text-red-400 transition"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-yellow-500 transition text-sm">
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* BOTÓN CARRITO */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-yellow-500 transition text-xl"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}