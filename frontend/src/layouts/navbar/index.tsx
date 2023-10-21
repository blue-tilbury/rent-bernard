import { Bars3Icon, HeartIcon } from "@heroicons/react/24/outline";
import { useAtomValue } from "jotai";
import { useState } from "react";

import { AccountIcon } from "./AccountIcon";
import { LoginLink } from "./LoginLink";
import { MenuModal } from "./MenuModal";
import Logo from "../../assets/logo-blue.svg?react";
import { CustomLink } from "../../components/CustomLink";
import useMediaQuery from "../../hooks/useMediaQuery";
import { userAtom } from "../../shared/globalStateConfig";

export const Navbar = () => {
  const user = useAtomValue(userAtom);
  const isAboveMediumScreen = useMediaQuery("(min-width: 768px)");
  const [IsMenuOpen, setIsMenuOpen] = useState(false);
  const isUserEmpty = Object.keys(user).length === 0;

  const handleMenuOpen = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="shadow-md">
      <div className="container flex items-center">
        <CustomLink to="/" type="noStyle">
          <Logo className="w-40 h-8" />
        </CustomLink>
        <div className="flex flex-1 justify-end py-6">
          <div
            className={
              isAboveMediumScreen && !isUserEmpty ? "flex items-center gap-4" : "hidden"
            }
          >
            <CustomLink to="wishlist" type="noStyle">
              <HeartIcon className="h-6 w-6 text-rent-gray hover:text-rent-dark-blue" />
            </CustomLink>
            <CustomLink to="posting" type="navbar">
              POST AD
            </CustomLink>
            <AccountIcon />
          </div>
          <LoginLink isVisible={isAboveMediumScreen && isUserEmpty} />
          <Bars3Icon
            onClick={handleMenuOpen}
            className={isAboveMediumScreen ? "hidden" : "h-6 w-6"}
          />
        </div>
      </div>

      <MenuModal
        handleMenuOpen={handleMenuOpen}
        hidden={isAboveMediumScreen || !IsMenuOpen}
      />
    </nav>
  );
};
