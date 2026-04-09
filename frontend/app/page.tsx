import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-base flex flex-col pt-20"> 
      <Hero />
      
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-gold-light mb-16">
          La Experiencia LuxGem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="glass p-10 rounded-xl hover:glass-hover transition-all duration-300">
             <span className="text-5xl block mb-6 drop-shadow-md">✨</span>
             <h3 className="text-xl font-semibold text-gold-light mb-3">Diseño Exclusivo</h3>
             <p className="text-foreground/80 font-light text-base leading-relaxed">Cada pieza es cuidadosamente fabricada por artesanos expertos con atención al más mínimo detalle.</p>
          </div>
          <div className="glass p-10 rounded-xl hover:glass-hover transition-all duration-300">
             <span className="text-5xl block mb-6 drop-shadow-md">💎</span>
             <h3 className="text-xl font-semibold text-gold-light mb-3">Materiales Premium</h3>
             <p className="text-foreground/80 font-light text-base leading-relaxed">Utilizamos oro, plata y gemas preciosas altamente seleccionadas de la más alta pureza.</p>
          </div>
          <div className="glass p-10 rounded-xl hover:glass-hover transition-all duration-300">
             <span className="text-5xl block mb-6 drop-shadow-md">🛡️</span>
             <h3 className="text-xl font-semibold text-gold-light mb-3">Garantía Superior</h3>
             <p className="text-foreground/80 font-light text-base leading-relaxed">Certeza de autenticidad y mantenimiento gratuito vitalicio para resguardar su inversión.</p>
          </div>
        </div>
      </section>
    </main>
  );
}