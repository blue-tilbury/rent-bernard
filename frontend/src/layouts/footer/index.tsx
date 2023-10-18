import { useAtomValue } from "jotai";

import { CustomLink } from "../../components/CustomLink";
import { userAtom } from "../../shared/globalStateConfig";

export const Footer = () => {
  const user = useAtomValue(userAtom);
  const isUserEmpty = Object.keys(user).length === 0;

  return (
    <footer className="w-full bg-rent-dark-blue">
      <div className="container py-10 text-white">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-3 pb-2 text-lg font-medium">
            <h2>RENT BERNARD</h2>
          </div>
          <div className="flex flex-2 flex-col gap-1 pb-8 text-sm font-light md:text-base">
            <CustomLink to="/" type="footer">
              Home
            </CustomLink>
            {isUserEmpty ? (
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
