"use client";

import { useCartStore } from "@/store/cartStore";
import { X } from "lucide-react";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getSubtotal,
    clearCart,
  } = useCartStore();

  return (
    <>
      {/* Overlay oscuro elegante */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-surface-base/80 backdrop-blur-md z-40 transition-all duration-300"
        />
      )}

      {/* Drawer oscuro */}
      <div
        className={`fixed top-0 right-0 h-full w-96 glass text-foreground shadow-2xl z-50 transform transition-transform duration-300 border-l border-surface-border flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-surface-border">
          <h2 className="text-xl font-bold text-gold-light tracking-wide font-sans">
            Tu Carrito
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-gold-light transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-4 opacity-50">🛒</span>
              <p className="text-foreground/60 font-light">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-surface-border/50 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-surface-base/50 rounded-md border border-surface-border overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-sm font-mono text-gold-light mt-1">
                      ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </p>
                  </div>

                  {/* Controles cantidad */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-surface-elevated border border-surface-border rounded-sm">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-2 py-0.5 text-gold-mid hover:text-gold-light hover:bg-surface-border transition-colors text-sm"
                      >
                        -
                      </button>

                      <span className="w-6 text-center font-semibold font-sans text-xs">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-2 py-0.5 text-gold-mid hover:text-gold-light hover:bg-surface-border transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-burgundy text-xs hover:text-red-400 transition-colors uppercase tracking-wider font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-surface-border space-y-5 bg-surface-base/50 mt-auto">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-foreground/80 font-sans">Subtotal:</span>
              <span className="text-gold-light font-mono">
                ${getSubtotal().toLocaleString('en-US', {minimumFractionDigits: 2})}
              </span>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className="block flex items-center justify-center bg-gold-mid hover:bg-gold-light text-surface-base font-semibold tracking-wide py-3.5 rounded-sm transition-all duration-300 shadow-[0_0_15px_rgba(199,152,79,0.2)] hover:shadow-[0_0_25px_rgba(199,152,79,0.4)]"
            >
              Ver Carrito Completo
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-xs font-semibold uppercase tracking-widest text-foreground/40 hover:text-burgundy transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}