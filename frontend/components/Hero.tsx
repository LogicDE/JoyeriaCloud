export default function Hero() {
  return (
    <section className="min-h-[80vh] bg-black text-white flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-6xl font-bold text-yellow-500 mb-6">
        Elegancia que trasciende el tiempo
      </h2>

      <p className="max-w-2xl text-gray-300 text-lg mb-8">
        Descubre nuestra colección exclusiva de joyas diseñadas para
        resaltar tu estilo y sofisticación.
      </p>

      <a
        href="/catalog"
        className="bg-yellow-500 text-black px-8 py-3 rounded-md font-semibold hover:scale-105 transition"
      >
        Ver Catálogo
      </a>
    </section>
  );
}