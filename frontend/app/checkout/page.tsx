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
    <div className="min-h-screen bg-surface-base text-foreground px-6 lg:px-10 py-24 md:pt-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-mid/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-12 tracking-wide font-sans drop-shadow-sm">
          Checkout Segmentado
        </h1>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="glass rounded-xl p-8 shadow-2xl space-y-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-surface-border pb-4">
              Datos de Envío y Pago
            </h2>

            <div>
              <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Nombre completo</label>
              <input
                type="text"
                placeholder="Juan Pérez"
                required
                className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Dirección</label>
              <input
                type="text"
                placeholder="Calle Principal 123"
                required
                className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Ciudad</label>
              <input
                type="text"
                placeholder="Ciudad Metropolitana"
                required
                className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all"
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Número de tarjeta (demo)</label>
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                required
                className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all font-mono"
                onChange={(e) => setForm({ ...form, card: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold-mid hover:bg-gold-light text-surface-base font-semibold tracking-wide py-4 mt-4 rounded-sm transition-all duration-300 shadow-[0_0_15px_rgba(199,152,79,0.2)] hover:shadow-[0_0_25px_rgba(199,152,79,0.4)] hover:-translate-y-0.5"
            >
              Confirmar Compra Segura
            </button>
          </form>

          {/* Resumen */}
          <div className="glass rounded-xl p-8 h-fit shadow-xl lg:sticky lg:top-32 border-t-4 border-t-gold-mid">
            <h2 className="text-xl font-bold text-gold-light mb-6 font-sans">
              Resumen del Pedido
            </h2>

            <div className="flex justify-between text-foreground/80 mb-6 pb-6 border-b border-surface-border">
              <span className="font-medium">Total a pagar:</span>
              <span className="font-mono text-xl font-bold text-gold-light">
                ${getSubtotal().toLocaleString('en-US', {minimumFractionDigits: 2})}
              </span>
            </div>

            <div className="flex items-start gap-3 bg-teal/10 p-4 rounded border border-teal/20">
              <span className="text-xl">🔒</span>
              <p className="text-sm text-foreground/70 font-light leading-relaxed">
                Este es un entorno seguro simulado para fines académicos. Sus datos están protegidos y no se realizarán cobros reales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}