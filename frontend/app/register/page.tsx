"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { register as registerApi } from "@/lib/api"; // ← función de api.ts
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { setAuth } = useAuth();                      // ← setAuth, no register
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerApi(name, email, password); // 1. llama api.ts
      setAuth(data.token, data.user);                        // 2. guarda en contexto
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-base text-foreground flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-mid/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-teal/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-2xl relative z-10 border border-surface-border/50">

        <div className="flex justify-center mb-6">
          <span className="text-4xl">✨</span>
        </div>

        <h1 className="text-3xl font-bold text-gold-light text-center mb-2 tracking-wide font-sans">
          Crear Cuenta
        </h1>
        <p className="text-foreground/60 text-center text-sm mb-8 font-light">
          Únete a JoyeriaCloud
        </p>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 text-sm px-4 py-3 rounded-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              required
              className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-foreground/80 text-sm mb-2 font-medium tracking-wide">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
              className="w-full bg-surface-elevated/50 border border-surface-border text-foreground rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-mid hover:bg-gold-light text-surface-base font-semibold tracking-wide py-3.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(199,152,79,0.2)] hover:shadow-[0_0_25px_rgba(199,152,79,0.4)] hover:-translate-y-0.5 mt-2"
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="text-foreground/60 text-sm text-center mt-8">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-gold-light hover:text-gold-mid font-medium transition-colors hover:underline underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}