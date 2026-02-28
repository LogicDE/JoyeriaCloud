type Props = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedPrice: string;
  setSelectedPrice: (value: string) => void;
};

export default function Filtro({
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
}: Props) {

  return ( 
    <div className="bg-gray-900 p-6 rounded-lg h-fit">
      <h2 className="text-yellow-500 text-xl font-semibold mb-4">
        Filtros
      </h2>

      <div className="space-y-3">
        {["Todos", "Anillos", "Collares", "Pulseras", "Aretes"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`block w-full text-left px-3 py-2 rounded-md transition ${
              selectedCategory === cat
                ? "bg-yellow-500 text-black"
                : "text-white hover:bg-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
