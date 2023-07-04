import { useState } from "react";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "./Link";
import useMediaQuery from "../../hooks/useMediaQuery";

export const Navbar = () => {
  const isAboveMediumScreen = useMediaQuery("(min-width: 768px)");
  const [isToggled, setIsToggled] = useState<boolean>(false);

  return (
    <nav className="shadow-md">
      <div className="container flex items-center">
        <h1 className="text-xl font-semibold uppercase">rent bernard</h1>
        <div className="flex flex-1 justify-end py-6">
          {isAboveMediumScreen ? (
            <div className="flex gap-4">
              <MagnifyingGlassIcon className="h-6 w-6" />
              <HeartIcon className="h-6 w-6" />
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
            <Link page="Search" setIsToggled={setIsToggled} />
            <Link page="Wishlist" setIsToggled={setIsToggled} />
            <Link page="Post" setIsToggled={setIsToggled} />
            <Link page="Edit" setIsToggled={setIsToggled} />
          </div>
        </div>
      )}
    </nav>
  );
};
