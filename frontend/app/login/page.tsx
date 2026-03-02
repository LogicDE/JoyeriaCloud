"use client";
// app/login/page.tsx
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res =
        mode === "login"
          ? await login(email, password)
          : await register(name, email, password);
      setAuth(res.token, res.user);
      router.push("/catalog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">💎</span>
            <h1 className="text-2xl font-bold text-white mt-3">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {mode === "login" ? "Accede a tu cuenta LuxGem" : "Únete a LuxGem"}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Tu nombre completo"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 placeholder-gray-600"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 placeholder-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-400 text-black font-bold py-3 rounded-lg uppercase tracking-wider text-sm transition mt-2"
            >
              {loading
                ? "Procesando..."
                : mode === "login"
                ? "Ingresar"
                : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <p className="text-gray-500">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => { setMode("register"); setError(null); }}
                  className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Regístrate
                </button>
              </p>
            ) : (
              <p className="text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>

          {/* Demo credentials */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-gray-600 text-xs text-center mb-2">Credenciales de prueba</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setEmail("admin@luxgem.com"); setPassword("admin123"); setMode("login"); }}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg transition"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail("maria@example.com"); setPassword("customer123"); setMode("login"); }}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg transition"
              >
                👤 Cliente
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
