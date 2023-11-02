import { useAtomValue } from "jotai";

import Logo from "../../assets/logo-white.svg?react";
import { CustomLink } from "../../components/CustomLink";
import { loggedIn, userAtom } from "../../shared/globalStateConfig";

export const Footer = () => {
  const user = useAtomValue(userAtom);

  return (
    <footer className="w-full bg-rent-dark-blue">
      <div className="py-10 text-white xl:w-[1280px] 2xl:w-[1536px] mx-auto px-8">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-3 pb-2 text-lg font-medium">
            <Logo className="h-8 w-36" />
          </div>
          <div className="flex flex-2 flex-col gap-1 pb-8 text-sm font-light md:text-base">
            <CustomLink to="/" type="footer">
              Home
            </CustomLink>
            {!loggedIn(user) ? (
              <CustomLink to="login" type="footer">
                Login
              </CustomLink>
            ) : (
              <>
                <CustomLink to="wishlist" type="footer">
                  My Wishlist
                </CustomLink>
                <CustomLink to="posting" type="footer">
                  Post Ad
                </CustomLink>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-xs">
          &copy; 2023 RENT BERNARD, Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
