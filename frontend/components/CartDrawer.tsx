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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      {/* Drawer oscuro */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-black text-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-yellow-500">
            Tu Carrito
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-500 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 overflow-y-auto h-[65%]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-3">🛒</span>
              <p className="text-gray-500">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-gray-800 pb-4"
              >
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover rounded-md border border-gray-700"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    ${item.price}
                  </p>

                  {/* Controles cantidad */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-900 border border-gray-700 rounded hover:border-yellow-500 transition"
                    >
                      -
                    </button>

                    <span className="font-semibold text-yellow-500">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-900 border border-gray-700 rounded hover:border-yellow-500 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-xs hover:text-red-400 transition"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-800 space-y-4">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-yellow-500">
                ${getSubtotal()}
              </span>
            </div>

            <Link
              href="/carrito"
              onClick={onClose}
              className="block text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition"
            >
              Ver Carrito Completo
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-500 hover:text-red-500 transition"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}