import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SmartImage from "../common/SmartImage";
import { promoImage } from "../../data/dummyProduct";

const stats = [
  { label: "Dispatch", value: "Global Same-Day" },
  { label: "Guarantee", value: "Authentic Pro Tiers" },
  { label: "Support", value: "Fit Specialist Active" },
];

const PromoBanner = () => (
  <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden text-white">
    <SmartImage src={promoImage} alt="Stadium" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-black/70" />

    <div className="relative z-10 max-w-2xl px-6 py-20 text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300">
        ▪ Matchday Concierge ▪
      </p>
      <h2 className="mt-4 font-heading text-5xl font-bold leading-tight lg:text-6xl">
        READY FOR YOUR<br />NEXT MATCH?
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-gray-300">
        Find the boots that match your game. Precision, technology, fit
        diagnostics and matchday express delivery.
      </p>
      <Link
        to="/boots"
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-sm bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-200"
      >
        Explore the Collection <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">{s.label}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PromoBanner;