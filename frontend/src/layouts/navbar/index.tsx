import {
  Bars3Icon,
  HeartIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";

import useMediaQuery from "../../hooks/useMediaQuery";

export const Navbar = () => {
  const isAboveMediumScreen = useMediaQuery("(min-width: 768px)");
  const [isToggled, setIsToggled] = useState<boolean>(false);

  return (
    <nav className="shadow-md">
      <div className="container flex items-center">
        <Link to="/" className="text-xl font-bold uppercase text-rent-blue">
          rent bernard
        </Link>
        <div className="flex flex-1 justify-end py-6">
          {isAboveMediumScreen ? (
            <div className="flex items-center gap-4">
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
              <Link
                to="login"
                className="p-2 text-sm font-bold text-rent-gray hover:text-rent-dark-blue"
              >
                LOGIN
              </Link>
            </div>
          ) : (
            <button onClick={() => setIsToggled(true)}>
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* menu modal */}
      {!isAboveMediumScreen && isToggled && (
        <div className="container fixed top-0 flex h-full w-full flex-col bg-rent-background-gray drop-shadow-xl z-20">
          <div className="flex justify-end py-6">
            <button onClick={() => setIsToggled(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-4 text-2xl font-medium items-start">
            <Link to="/" onClick={() => setIsToggled(false)}>
              Home
            </Link>
            <Link to="wishlist" onClick={() => setIsToggled(false)}>
              Wishlist
            </Link>
            <Link to="posting" onClick={() => setIsToggled(false)}>
              Post Ad
            </Link>
            <Link to="login" onClick={() => setIsToggled(false)}>
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
