import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../common/ProductCard";
import { newArrivals } from "../../data/dummyProduct";

const FreshOnThePitch = () => (
  <section className="bg-neutral-50 px-6 py-20 lg:px-10">
    <div className="mb-12 flex items-end justify-between">
      <h2 className="font-heading text-4xl font-bold">FRESH ON THE PITCH</h2>
      <Link
        to="/new-arrivals"
        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest hover:gap-2 transition-all"
      >
        View All <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {newArrivals.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </section>
);

export default FreshOnThePitch;