import { Bars3Icon, HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";

import { AccountIcon } from "./AccountIcon";
import { MenuModal } from "./MenuModal";
import Logo from "../../assets/logo-no-background.png";
import useMediaQuery from "../../hooks/useMediaQuery";

export const Navbar = () => {
  const isAboveMediumScreen = useMediaQuery("(min-width: 768px)");
  const [IsMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="shadow-md">
      <div className="container flex items-center">
        <Link to="/" className="text-xl font-bold uppercase text-rent-blue">
          <img src={Logo} className=" w-40" />
        </Link>
        <div className="flex flex-1 justify-end py-6">
          <div
            className={`${isAboveMediumScreen ? "flex items-center gap-4" : "hidden"}`}
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-rent-gray hover:text-rent-dark-blue" />
            <Link to="wishlist">
              <HeartIcon className="h-6 w-6 text-rent-gray hover:text-rent-dark-blue" />
            </Link>
            <Link
              to="posting"
              className="p-2 text-sm font-bold text-rent-gray hover:text-rent-dark-blue"
            >
              POST AD
            </Link>
            <AccountIcon />
          </div>
          <button
            onClick={handleMenuOpen}
            className={isAboveMediumScreen ? "hidden" : ""}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <MenuModal
        handleMenuOpen={handleMenuOpen}
        hidden={isAboveMediumScreen || !IsMenuOpen}
      />
    </nav>
  );
};
