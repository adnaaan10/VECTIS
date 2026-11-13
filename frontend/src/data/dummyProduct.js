// Replace these URLs with your own imports from src/assets/images for production.
// SmartImage gracefully falls back to a placeholder if a URL ever fails.

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

export const heroImage = {
  hero: u("photo-1511426463457-0571e247d816"),
  pair: u("photo-1684355414454-ed132f6c41cd"),
  pitch: u("photo-1711071996114-57e07a00f92b"),
}
export const heroLabels = {
  top: 'PROPULSION PLATE // V-01',
  bottom: 'STAGE // STAMFORD PRIME',
};

export const promoImage = u("photo-1641005951826-00eefd13afd5");

export const categories = [
  { code: 'FG', name: 'Firm Ground',     description: 'Designed for natural grass surfaces, providing traction and stability.', image: "https://media.istockphoto.com/id/2286475038/photo/hands-grass-and-soccer-player-tying-laces-for-match-training-or-exercise-outdoor-on-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=XBPh1lMkZ0F1zzXZ3mt_zVlQbKUKLrMfqZ0TBB5g6Fw=" },
  { code: 'AG', name: 'Artificial Ground', description: 'Built for artificial grass pitches with multiple small studs.',        image: u("photo-1633306603064-582250e68a1a"), },
  { code: 'SG', name: 'Soft Ground',     description: 'Designed for soft, wet natural grass surfaces with longer studs.',      image: u("photo-1715270525118-ce589797568b"), },
  { code: 'TF', name: 'Turf',            description: 'Designed for artificial turf and shorter synthetic grass surfaces.',    image: u("photo-1529900748604-07564a03e7a6"), },
  { code: 'IC', name: 'Indoor Court',    description: 'Designed for indoor court surfaces with flat, non-marking rubber soles.', image: u("photo-1763775468707-573c7cd6b0da"),},
];

export const featuredBoots = [
  {
    id: "mercurial-vapor-16",
    brand: "Nike",
    name: "Mercurial Vapor 16 Elite",
    badge: "NEW GEN",
    variant: "ELITE",
    discount: 8,
    price: "275.00",
    oldPrice: "299.00",
    image: heroImage.pitch,
  },
  {
    id: "predator-24",
    brand: "Adidas",
    name: "Predator 24 Elite",
    badge: "FOLD TONGUE",
    variant: "ELITE",
    discount: 7,
    price: "280.00",
    oldPrice: "300.00",
    image: heroImage.pair,
  },
  {
    id: "future-7",
    brand: "Puma",
    name: "Future 7 Ultimate",
    badge: "PWRTAPE",
    variant: "ELITE",
    discount: null,
    price: "240.00",
    oldPrice: null,
    image: heroImage.hero,
  },
  {
    id: "furon-v7",
    brand: "New Balance",
    name: "Furon V7+",
    badge: "SPEED MAT",
    variant: "PRO",
    discount: null,
    price: "225.00",
    oldPrice: null,
    image: heroImage.pair,
  },
];

export const newArrivals = [
  {
    id: "morelia-neo-iv",
    brand: "Mizuno",
    name: "Morelia Neo IV Beta",
    badge: "NEW ARRIVAL",
    variant: "MJ",
    price: "320.00",
    image: heroImage.pitch,
  },
  {
    id: "phantom-luna-ii",
    brand: "Nike",
    name: "Phantom Luna II",
    badge: "NEW ARRIVAL",
    variant: "ELITE",
    price: "285.00",
    image: heroImage.hero,
  },
  {
    id: "copa-pure-2",
    brand: "Adidas",
    name: "Copa Pure 2 Elite",
    badge: "NEW ARRIVAL",
    variant: "ELITE",
    price: "250.00",
    image: heroImage.pair,
  },
  {
    id: "ultra-5",
    brand: "Puma",
    name: "Ultra 5 Ultimate Carbon",
    badge: "NEW ARRIVAL",
    variant: "CARBON",
    price: "260.00",
    image: heroImage.pitch,
  },
];

export const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Mizuno'];