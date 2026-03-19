import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContent";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
  } = useAppContext();

  const logout = () => {
    try {
      localStorage.removeItem("userToken");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setIsOpen(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    setShowUserLogin(true);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <NavLink to="/" onClick={() => setIsOpen(false)}>
        <img src={assets.logo} alt="logo" className="h-9" />
      </NavLink>

      {/* ================= DESKTOP MENU ================= */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/products">All Products</NavLink>

        <NavLink to="/contact">Contact</NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          to="/cart"
          className="relative cursor-pointer"
        >
          <img
            src={assets.cart_icon}
            alt="cart"
            className="w-6 opacity-70 hover:opacity-50"
          />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {getCartCount()}
          </span>
        </div>

        {/* Login / Logout */}
        {!user ? (
          <button
            onClick={handleLoginClick}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} alt="profile" className="w-10" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("/my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ================= MOBILE MENU BUTTON ================= */}

      <div className="flex items-center gap-6 sm:hidden hover:cursor-pointer">
        <div
          onClick={() => navigate("/cart")}
          to="/cart"
          className="relative cursor-pointer"
        >
          <img
            src={assets.cart_icon}
            alt="cart"
            className="w-6 opacity-70 hover:opacity-50 "
          />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {getCartCount()}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          className=""
        >
          <img
            src={assets.menu_icon}
            alt="menu"
            className="hover:cursor-pointer"
          />
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
  className={`absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-3 px-5 text-sm sm:hidden
  transform transition-all duration-300 ease-in-out z-50
  ${
    isOpen
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-4 pointer-events-none"
  }`}
>
  <NavLink to="/" onClick={() => setIsOpen(false)}>
    Home
  </NavLink>

  <NavLink to="/products" onClick={() => setIsOpen(false)}>
    All Products
  </NavLink>

  {user && (
    <NavLink to="/products" onClick={() => setIsOpen(false)}>
      My Orders
    </NavLink>
  )}

  <NavLink to="/contact" onClick={() => setIsOpen(false)}>
    Contact
  </NavLink>

  {!user ? (
    <button
      onClick={handleLoginClick}
      className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
    >
      Login
    </button>
  ) : (
    <button
      onClick={logout}
      className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
    >
      Logout
    </button>
  )}
</div>
    </nav>
  );
}

export default Navbar;
