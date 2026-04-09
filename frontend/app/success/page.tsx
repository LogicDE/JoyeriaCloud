import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-surface-base text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gold-mid/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="glass p-12 md:p-16 rounded-2xl shadow-2xl border border-surface-border text-center max-w-lg w-full flex flex-col items-center relative z-10">
        <div className="w-24 h-24 bg-surface-elevated rounded-full flex items-center justify-center mb-8 border-4 border-gold-mid shadow-[0_0_30px_rgba(199,152,79,0.3)]">
          <span className="text-5xl">✨</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-4 font-sans text-center tracking-wide">
          ¡Compra Exitosa!
        </h1>

        <p className="text-foreground/70 mb-10 text-center font-light text-lg">
          Gracias por confiar en LuxGem. Hemos procesado tu compra y comenzamos a preparar tu exclusiva pieza.
        </p>

        <Link
          href="/catalog"
          className="bg-gold-mid hover:bg-gold-light text-surface-base font-semibold px-8 py-4 rounded-sm transition-all shadow-[0_0_15px_rgba(199,152,79,0.2)] hover:shadow-[0_0_25px_rgba(199,152,79,0.4)] hover:-translate-y-1 block w-full text-center tracking-wider uppercase text-sm"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}