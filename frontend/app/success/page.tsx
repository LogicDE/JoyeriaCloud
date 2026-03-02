import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-yellow-500 mb-4">
        ¡Compra Exitosa! 🎉
      </h1>

      <p className="text-gray-400 mb-8">
        Gracias por tu compra.
      </p>

      <Link
        href="/catalog"
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg transition"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}