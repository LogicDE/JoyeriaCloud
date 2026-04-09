import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-[80vh] relative overflow-hidden flex flex-col items-center justify-center text-center px-6 mt-[-80px] pt-20">
      {/* Fondos dinámicos en degradado para lujo */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal/20 via-surface-base to-navy/30"></div>
      
      {/* Efectos de luz "glow" */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-burgundy/10 rounded-full blur-[140px] -z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[40vw] h-[40vw] bg-gold-mid/10 rounded-full blur-[100px] -z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gold-light mb-6 drop-shadow-xl tracking-wide leading-tight">
          Elegancia que trasciende <span className="text-white block mt-2">el tiempo</span>
        </h1>

        <p className="max-w-2xl text-foreground/80 text-xl font-light mb-10 leading-relaxed">
          Descubre nuestra colección exclusiva de alta joyería. Piezas únicas diseñadas meticulosamente para realzar tu sofisticación y estilo personal profundo.
        </p>

        <Link
          href="/catalog"
          className="bg-gold-mid text-surface-base px-10 py-4 rounded-sm font-semibold text-lg hover:bg-gold-light hover:-translate-y-1 transition-all duration-300 shadow-[0_0_25px_rgba(199,152,79,0.25)] hover:shadow-[0_0_40px_rgba(199,152,79,0.5)]"
        >
          Explorar Catálogo
        </Link>
      </div>
    </section>
  );
}