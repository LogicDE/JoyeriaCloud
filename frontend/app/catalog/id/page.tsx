type Props = {
  params: { id: string };
};

const products = [
  { id: 1, name: "Anillo de Oro", price: 350, description: "Anillo elegante en oro 18k." },
  { id: 2, name: "Collar de Plata", price: 220, description: "Collar fino en plata pura." },
  { id: 3, name: "Pulsera Platino", price: 480, description: "Pulsera premium de platino." },
  { id: 4, name: "Aretes Diamante", price: 650, description: "Aretes con diamantes naturales." },
  { id: 5, name: "Anillo Esmeralda", price: 520, description: "Anillo con esmeralda central." },
  { id: 6, name: "Cadena Oro Blanco", price: 400, description: "Cadena fina de oro blanco." },
];

export default function ProductDetail({ params }: Props) {
  const product = products.find(
    (p) => p.id === Number(params.id)
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Producto no encontrado
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-10 py-16">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        
        <div className="bg-gray-800 h-80 rounded-lg flex items-center justify-center text-gray-400">
          Imagen del producto
        </div>

        <div>
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">
            {product.name}
          </h1>

          <p className="text-gray-300 mb-6">
            {product.description}
          </p>

          <p className="text-2xl font-bold text-white mb-6">
            ${product.price}
          </p>

          <button className="bg-yellow-500 text-black px-8 py-3 rounded-md hover:bg-yellow-400 transition">
            Agregar al carrito
          </button>
        </div>

      </div>
    </main>
  );
}