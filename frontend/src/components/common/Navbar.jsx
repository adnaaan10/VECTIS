import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { label: "Home", to: "/" },
  { label: "All Boots", to: "/boots" },
  { label: "Brands", to: "/brands" },
  { label: "New Arrivals", to: "/new-arrivals" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const {user,logout} = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="font-heading text-xl font-bold tracking-widest">
          VECTIS
        </Link>

        {/* Center links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  active ? "text-black" : "text-gray-500 hover:text-black"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4 text-gray-700">
          <button aria-label="Search" className="hover:text-black"><Search className="h-5 w-5" /></button>
          <button aria-label="Wishlist" className="hover:text-black"><Heart className="h-5 w-5" /></button>
          <button aria-label="Cart" className="relative hover:text-black">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
              0
            </span>
          </button>
          {user ? (
              <div className="flex items-center gap-3">
                  <Link
                      to="/account"
                      aria-label="Account"
                      className="rounded-full bg-black p-1.5 text-white"
                  >
                      <User className="h-4 w-4" />
                  </Link>

                  <button
                      type="button"
                      onClick={async () => {
                          await logout();
                      }}
                      className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 transition-colors hover:text-black"
                  >
                      Logout
                  </button>
              </div>
          ) : (
              <Link
                  to="/login"
                  className="text-[10px] font-semibold uppercase tracking-widest text-gray-700 transition-colors hover:text-black"
              >
                  Login
              </Link>
          )}

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
          <nav className="flex flex-col border-t border-gray-200 px-6 py-4 md:hidden">

              {/* Navigation links */}
              {links.map((l) => (
                  <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`py-2 text-[11px] font-semibold uppercase tracking-widest ${
                          pathname === l.to
                              ? "text-black"
                              : "text-gray-500"
                      }`}
                  >
                      {l.label}
                  </Link>
              ))}

              {/* Authentication links */}
              <div className="mt-3 border-t border-gray-200 pt-3">

                  {user ? (
                      <>
                          <Link
                              to="/account"
                              onClick={() => setOpen(false)}
                              className="block py-2 text-[11px] font-semibold uppercase tracking-widest text-gray-700"
                          >
                              My Account
                          </Link>

                          <button
                              type="button"
                              onClick={async () => {
                                  await logout();
                                  setOpen(false);
                              }}
                              className="py-2 text-[11px] font-semibold uppercase tracking-widest text-gray-700 hover:text-black"
                          >
                              Logout
                          </button>
                      </>
                  ) : (
                      <Link
                          to="/login"
                          onClick={() => setOpen(false)}
                          className="block py-2 text-[11px] font-semibold uppercase tracking-widest text-gray-700"
                      >
                          Login
                      </Link>
                  )}

              </div>
          </nav>
      )}
    </header>
  );
};

export default Navbar;