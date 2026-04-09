"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-base text-foreground flex flex-col items-center justify-center pt-20">
        <ShoppingCart size={80} className="text-gold-mid/30 mb-8" />
        <h1 className="text-3xl md:text-4xl font-bold text-gold-light mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-foreground/60 mb-10 text-center text-lg max-w-md font-light">
          Parece que aún no has seleccionado ninguna de nuestras exclusivas piezas.
        </p>

        <Link
          href="/catalog"
          className="bg-gold-mid hover:bg-gold-light text-surface-base hover:-translate-y-1 font-semibold px-8 py-3.5 rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(199,152,79,0.2)]"
        >
          Explorar el Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base text-foreground px-6 lg:px-10 py-24 md:pt-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-12 tracking-wide drop-shadow-sm">
          Resumen de Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Lista de productos */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass rounded-xl p-8 shadow-xl">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-surface-border last:border-0 py-6 last:pb-0 first:pt-0 gap-6"
                >
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="w-24 h-24 bg-surface-base/50 rounded-lg overflow-hidden border border-surface-border flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <h2 className="font-bold text-lg text-foreground line-clamp-2">
                        {item.name}
                      </h2>
                      <p className="text-gold-light text-lg font-mono mt-1">
                        ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center bg-surface-elevated border border-surface-border rounded-sm">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="px-3 py-1 text-gold-mid hover:text-gold-light hover:bg-surface-border transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="px-3 py-1 text-gold-mid hover:text-gold-light hover:bg-surface-border transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto h-full">
                    <p className="font-bold text-xl text-gold-light font-mono">
                      ${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-burgundy hover:text-red-400 transition-colors mt-2 flex items-center gap-1 text-sm font-semibold uppercase tracking-wider"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={16} /> <span className="hidden sm:inline">Remover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pr-4">
              <button
                onClick={clearCart}
                className="text-sm font-semibold tracking-wide uppercase text-foreground/40 hover:text-burgundy transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Vaciar Carrito
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className="glass rounded-xl p-8 h-fit shadow-xl sticky top-28">
            <h2 className="text-2xl font-bold text-gold-light mb-8 font-sans">
              Total del Pedido
            </h2>

            <div className="flex justify-between mb-4 text-foreground/70 font-sans">
              <span>Piezas Totales:</span>
              <span className="font-semibold text-foreground">{getTotalItems()}</span>
            </div>

            <div className="flex justify-between mb-6 text-foreground/70 font-sans">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">${getSubtotal().toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>
            
            <div className="w-full h-px bg-surface-border mb-6"></div>

            <div className="flex justify-between font-bold text-xl mb-10 text-gold-light font-sans">
              <span>Total Estimado:</span>
              <span className="font-mono">${getSubtotal().toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>

            <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-gold-mid hover:bg-gold-light text-surface-base font-semibold py-4 rounded-sm transition-all shadow-md group"
            >
              Proceder al Pago
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/catalog"
              className="block text-center mt-6 text-sm text-foreground/50 hover:text-gold-light transition-colors uppercase tracking-widest font-semibold"
            >
              Seguir Explorando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}