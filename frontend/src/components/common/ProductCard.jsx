
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import SmartImage from "./SmartImage";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);

  const {
    brand,
    name,
    badge,
    variant,
    discount,
    price,
    oldPrice,
    image,
    id,
  } = product;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-sm border border-gray-200 bg-white">

      {/* Image area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">

        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-sm bg-black px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:text-black"
        >
          <Heart
            className={`h-4 w-4 ${
              liked ? "fill-black text-black" : ""
            }`}
          />
        </button>

        <SmartImage
          src={image}
          alt={name}
          label={name}
          className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-5">

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            {brand}
          </span>

          {discount ? (
            <span className="text-[10px] font-bold text-red-600">
              -{discount}%
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              {variant}
            </span>
          )}
        </div>

        <h3 className="mt-2 min-h-10 font-heading text-base font-bold leading-snug text-gray-900">
          {name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-bold text-gray-900">
            ${price}
          </span>

          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${oldPrice}
            </span>
          )}
        </div>

        <Link
          to={`/product/${id}`}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-sm bg-black py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
        >
          View Product
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

      </div>
    </div>
  );
};

export default ProductCard;
