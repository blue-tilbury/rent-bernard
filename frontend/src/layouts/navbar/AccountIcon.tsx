import { useAtomValue } from "jotai";
import { useState } from "react";
import { Link } from "react-router-dom";

import { UserMenu } from "./UserMenu";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { userAtom } from "../../pages/Login";

export const AccountIcon = () => {
  const user = useAtomValue(userAtom);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isUserEmpty = Object.keys(user).length === 0;
  const ref = useOutsideClick(setIsUserMenuOpen, false);

  return (
    <>
      <div ref={ref} className={`${isUserEmpty ? "hidden" : "relative flex"}`}>
        <button onClick={() => setIsUserMenuOpen((prev) => !prev)}>
          <img src={user.picture} className="h-8 w-8 rounded-full" />
        </button>
        <UserMenu user={user} isUserMenuOpen={isUserMenuOpen} />
      </div>
      <Link
        to="login"
        className={`${
          isUserEmpty
            ? "p-2 text-sm font-bold text-rent-gray hover:text-rent-dark-blue"
            : "hidden"
        }`}
      >
        LOGIN
      </Link>
    </>
  );
};
