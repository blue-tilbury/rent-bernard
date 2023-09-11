import { useState } from "react";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useMediaQuery from "../../hooks/useMediaQuery";
import { Link } from "react-router-dom";

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
        <div className="container fixed top-0 flex h-full w-full flex-col bg-rent-background-gray drop-shadow-xl">
          <div className="flex justify-end py-6">
            <button
              onClick={() => {
                setIsToggled(false);
              }}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-4 text-2xl font-medium">
            <Link to="/">Home</Link>
            <Link to="wishlist">Wishlist</Link>
            <Link to="posting">Posting</Link>
            <Link to="edit">Edit</Link>
          </div>
        </div>
      )}
    </nav>
  );
};
