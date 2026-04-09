"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/lib/api";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image_url || "",
    });
  };

  return (
    <div className="group glass p-5 rounded-xl hover:glass-hover transition-all duration-500 shadow-xl flex flex-col h-full relative overflow-hidden">
      
      {/* Decorative gradient behind image */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-mid/5 rounded-full blur-[50px] -z-10 group-hover:bg-gold-mid/10 transition-colors"></div>

      <Link href={`/catalog/${product.id}`} className="block flex-grow">
        <div className="h-64 bg-surface-base/50 rounded-lg overflow-hidden flex items-center justify-center text-foreground/20 mb-5 relative border border-surface-border group-hover:border-gold-mid/20 transition-colors">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <span className="text-4xl opacity-50 drop-shadow-md">💎</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gold-mid/80">
            {product.category?.name || "Colección Exclusiva"}
          </p>
          <h2 className="text-lg font-bold text-foreground leading-tight group-hover:text-gold-light transition-colors line-clamp-2">
            {product.name}
          </h2>

          <p className="text-gold-light text-xl font-semibold mt-2 font-sans tracking-wide">
            ${parseFloat(product.price).toLocaleString('en-US', {minimumFractionDigits: 2})}
          </p>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart();
        }}
        disabled={product.stock === 0}
        className="mt-6 w-full flex items-center justify-center gap-2 border border-gold-mid/40 text-gold-light py-2.5 rounded-sm hover:bg-gold-mid hover:text-surface-base hover:border-gold-mid transition-all duration-300 disabled:bg-surface-elevated disabled:text-foreground/40 disabled:border-surface-border disabled:cursor-not-allowed group-hover:shadow-[0_4px_14px_rgba(199,152,79,0.15)]"
        aria-label={`Añadir ${product.name} al carrito`}
      >
        <ShoppingCart size={18} />
        <span className="font-sans font-semibold tracking-wide text-sm">{product.stock === 0 ? "Agotado" : "Añadir al Carrito"}</span>
      </button>
    </div>
  );
}