"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import { ShoppingCart, User, LogOut } from "lucide-react"; // Aprovechando lucide-react que está en la spec

export default function Navbar() {
  const { getTotalItems } = useCartStore();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = getTotalItems();

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass border-b-0 border-gold-mid/10 transition-all">
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center text-foreground">
          
          <Link href="/" className="text-3xl tracking-widest font-bold text-gold-light transition-transform hover:scale-105" aria-label="Volver a Inicio">
            LuxGem.
          </Link>

          <div className="flex items-center gap-6 md:gap-10 font-light text-sm md:text-base">
            <Link href="/" className="hover:text-gold-light transition-colors">
              Inicio
            </Link>

            <Link href="/catalog" className="hover:text-gold-light transition-colors">
              Catálogo
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 hover:text-gold-light transition-colors" aria-label="Mi Perfil">
                  <User size={18} />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-foreground/50 hover:text-burgundy transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-gold-light transition-colors">
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-block border border-gold-mid/50 text-gold-light hover:bg-gold-mid hover:text-surface-base px-5 py-2 rounded-sm transition-all duration-300"
                >
                  Registro
                </Link>
              </div>
            )}

            {/* BOTÓN CARRITO */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-gold-light transition-colors"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-burgundy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-surface-base">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}