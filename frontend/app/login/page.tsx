"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi } from "@/lib/api";   // ← función de api.ts
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { setAuth } = useAuth();                  // ← setAuth, no login
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi(email, password); // 1. llama api.ts
      setAuth(data.token, data.user);               // 2. guarda en contexto
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        
        <h1 className="text-3xl font-bold text-yellow-500 text-center mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-zinc-400 text-center text-sm mb-8">
          Bienvenido de nuevo a JoyeriaCloud
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-zinc-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition"
            />
          </div>

          <div>
            <label className="block text-zinc-300 text-sm mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-zinc-400 text-sm text-center mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-yellow-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}