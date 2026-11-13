import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SmartImage from "../common/SmartImage";
import { heroImage, heroLabels } from "../../data/dummyProduct";

const HeroSection = () => (
  <section className="flex min-h-[80vh] flex-col bg-black text-white lg:flex-row">
    {/* Left */}
    <div className="flex flex-col justify-center p-10 lg:w-1/2 lg:p-16">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-300">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        Engineered for the game
      </div>
      <h1 className="mt-6 font-heading text-5xl font-bold leading-[1.05] lg:text-7xl">
        FIND YOUR<br />PERFECT<br />GAME.
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-300">
        Discover premium football boots designed for every surface, every
        position and every style of play.
      </p>
      <Link
        to="/boots"
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-sm bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-200"
      >
        Shop All Boots
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>

    {/* Right */}
    <div className="relative h-64 lg:h-auto lg:w-1/2">
      <SmartImage
        src={heroImage.hero}
        alt="Football boot on pitch"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute right-6 top-6 rounded-sm bg-black/40 px-2 py-1 text-[10px] uppercase tracking-widest text-gray-200 backdrop-blur-sm">
        {heroLabels.top}
      </span>
      <span className="absolute bottom-6 right-6 rounded-sm bg-black/40 px-2 py-1 text-[10px] uppercase tracking-widest text-gray-200 backdrop-blur-sm">
        {heroLabels.bottom}
      </span>
    </div>
  </section>
);

export default HeroSection;