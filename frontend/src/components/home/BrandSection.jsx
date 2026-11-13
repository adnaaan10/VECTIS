import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { brands } from "../../data/dummyProduct";

const BrandSection = () => (
  <section className="bg-white px-6 py-20 lg:px-10">
    <h2 className="mb-12 font-heading text-4xl font-bold">SHOP YOUR FAVOURITE BRAND</h2>
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {brands.map((b) => (
        <Link
          key={b}
          to={`/boots?brand=${encodeURIComponent(b)}`}
          className="group flex items-center justify-between rounded-sm border border-gray-200 p-8 transition-colors hover:bg-black hover:text-white"
        >
          <span className="font-heading text-lg font-bold">{b}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  </section>
);

export default BrandSection;