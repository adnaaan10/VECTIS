import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SmartImage from "../common/SmartImage";
import { categories } from "../../data/dummyProduct";

const CategorySection = () => (
  <section className="bg-white px-6 py-20 lg:px-10">
    <h2 className="mb-12 font-heading text-4xl font-bold">FIND YOUR SURFACE</h2>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {categories.map((c) => (
        <div key={c.code} className="flex flex-col overflow-hidden rounded-sm border border-gray-200">
          <SmartImage
            src={c.image}
            alt={c.name}
            label={c.name}
            className="aspect-square w-full object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold">{c.name}</h3>
              <span className="text-[10px] text-gray-400">{c.code}</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-gray-500">{c.description}</p>
            <Link
              to={`/boots?surface=${c.code}`}
              className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:gap-2 transition-all"
            >
              Explore <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default CategorySection;