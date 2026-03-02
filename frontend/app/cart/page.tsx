"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🛒</span>
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Parece que aún no has agregado productos.
        </p>

        <Link
          href="/catalog"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg transition"
        >
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-16">
      <h1 className="text-4xl font-bold text-yellow-500 mb-10">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Lista de productos */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-gray-800 py-6"
            >
              <div className="flex items-center gap-6">
                <img
                  src={item.image}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                />

                <div>
                  <h2 className="font-bold text-lg">
                    {item.name}
                  </h2>
                  <p className="text-gray-400">
                    ${item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-3 py-1 bg-black border border-gray-700 rounded hover:border-yellow-500 transition"
                    >
                      -
                    </button>

                    <span className="font-semibold text-yellow-500">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-3 py-1 bg-black border border-gray-700 rounded hover:border-yellow-500 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-yellow-500">
                  ${item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm hover:text-red-400 transition mt-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-8">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 h-fit">
          <h2 className="text-xl font-bold text-yellow-500 mb-6">
            Resumen de compra
          </h2>

          <div className="flex justify-between mb-4 text-gray-400">
            <span>Productos:</span>
            <span>{getTotalItems()}</span>
          </div>

          <div className="flex justify-between mb-4 text-gray-400">
            <span>Subtotal:</span>
            <span>${getSubtotal()}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t border-gray-800 pt-4 text-yellow-500">
            <span>Total:</span>
            <span>${getSubtotal()}</span>
          </div>

          <button className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition">
            Proceder al Checkout
          </button>

          <Link
            href="/catalog"
            className="block text-center mt-6 text-sm text-gray-500 hover:text-yellow-500 transition"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}