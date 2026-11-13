import ProductCard from "../common/ProductCard";
import { featuredBoots } from "../../data/dummyProduct";

const FeaturedBoots = () => (
  <section className="bg-neutral-50 px-6 py-20 lg:px-10">
    <h2 className="mb-12 font-heading text-4xl font-bold">FEATURED BOOTS</h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredBoots.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </section>
);

export default FeaturedBoots;