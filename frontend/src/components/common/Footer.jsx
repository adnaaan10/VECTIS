import { Link } from "react-router-dom";

const shopLinks = [
  { label: "All Football Boots", to: "/boots" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "FG Boots", to: "/boots?surface=FG" },
  { label: "AG Boots", to: "/boots?surface=AG" },
  { label: "SG Boots", to: "/boots?surface=SG" },
  { label: "Turf Boots", to: "/boots?surface=TF" },
  { label: "Indoor Court Boots", to: "/boots?surface=IC" },
];

const accountLinks = [
  { label: "My Profile", to: "/account" },
  { label: "Active Bags", to: "/account/bags" },
  { label: "Saved Items", to: "/account/saved" },
  { label: "Order History", to: "/account/orders" },
  { label: "Customer Support", to: "/support" },
];

const Footer = () => (
  <footer className="bg-white">
    <div className="grid grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3 lg:px-10">
      <div>
        <h3 className="font-heading text-xl font-bold tracking-widest">VECTIS</h3>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
          Engineering the next generation of football precision. Ultra-refined,
          high-performance digital footwear catalog built for athletes seeking
          raw pitch mastery.
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Shop</h4>
        <ul className="mt-4 space-y-2">
          {shopLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="text-sm text-gray-500 hover:text-black">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Account</h4>
        <ul className="mt-4 space-y-2">
          {accountLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="text-sm text-gray-500 hover:text-black">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="border-t border-gray-200 px-6 py-6 lg:px-10">
      <p className="text-[10px] uppercase tracking-widest text-gray-400">
        © 2026 VECTIS. All Rights Reserved.
      </p>
    </div>
  </footer>
);

export default Footer;