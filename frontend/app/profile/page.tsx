"use client";

import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">

          <h1 className="text-3xl font-bold text-yellow-500 mb-6">Mi Perfil</h1>

          <div className="flex flex-col gap-4 mb-8">
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Nombre</p>
              <p className="text-white text-lg font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Email</p>
              <p className="text-white text-lg">{user?.email}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Rol</p>
              <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full capitalize">
                {user?.role}
              </span>
            </div>
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Miembro desde</p>
              <p className="text-white text-sm">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full border border-red-700 text-red-400 hover:bg-red-900/30 font-semibold py-3 rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </main>
    </AuthGuard>
  );
}