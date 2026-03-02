"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { getSubtotal, clearCart } = useCartStore();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    card: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de pago exitoso
    clearCart();
    router.push("/success");
  };

  return (
    <div className="min-h-screen bg-black text-white px-10 py-16">
      <h1 className="text-4xl font-bold text-yellow-500 mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6"
        >
          <input
            type="text"
            placeholder="Nombre completo"
            required
            className="w-full p-3 bg-black border border-gray-700 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Dirección"
            required
            className="w-full p-3 bg-black border border-gray-700 rounded"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <input
            type="text"
            placeholder="Ciudad"
            required
            className="w-full p-3 bg-black border border-gray-700 rounded"
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          <input
            type="text"
            placeholder="Número de tarjeta (demo)"
            required
            className="w-full p-3 bg-black border border-gray-700 rounded"
            onChange={(e) => setForm({ ...form, card: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition"
          >
            Confirmar Compra
          </button>
        </form>

        {/* Resumen */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 h-fit">
          <h2 className="text-xl font-bold text-yellow-500 mb-6">
            Resumen
          </h2>

          <div className="flex justify-between text-gray-400 mb-4">
            <span>Total a pagar:</span>
            <span>${getSubtotal()}</span>
          </div>

          <p className="text-sm text-gray-500">
            * Este es un pago simulado para fines académicos.
          </p>
        </div>
      </div>
    </div>
  );
}