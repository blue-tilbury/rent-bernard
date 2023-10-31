import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAtomValue } from "jotai";

import { Logout } from "./Logout";
import { MenuModalLink } from "./MenuModalLink";
import { loggedIn, userAtom } from "../../shared/globalStateConfig";

type MenuModalProps = {
  handleMenuOpen(): void;
  hidden: boolean;
};

export const MenuModal = ({ handleMenuOpen, hidden }: MenuModalProps) => {
  const user = useAtomValue(userAtom);

  return (
    <div
      className={`${
        hidden
          ? "hidden"
          : "container fixed top-0 z-20 flex h-full w-full flex-col bg-rent-bg-gray drop-shadow-xl"
      }`}
    >
      <div className="flex justify-end py-6">
        <XMarkIcon className="h-6 w-6" onClick={handleMenuOpen} />
      </div>
      <div className="flex flex-col items-start gap-4 text-2xl font-medium">
        <MenuModalLink to="/" handleClick={handleMenuOpen} />
        {!loggedIn(user) ? (
          <MenuModalLink to="login" handleClick={handleMenuOpen} />
        ) : (
          <>
            <MenuModalLink to="wishlist" handleClick={handleMenuOpen} />
            <MenuModalLink to="posting" handleClick={handleMenuOpen} />
            <MenuModalLink to="your-ads" handleClick={handleMenuOpen} />
            <MenuModalLink to="your-reviews" handleClick={handleMenuOpen} />
            <Logout type="menuModal" handleClick={handleMenuOpen} />
          </>
        )}
      </div>
    </div>
  );
};
