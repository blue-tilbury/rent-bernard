import { XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

type MenuModalProps = {
  handleMenuOpen(): void;
  hidden: boolean;
};

export const MenuModal = ({ handleMenuOpen, hidden }: MenuModalProps) => {
  return (
    <div
      className={`${
        hidden
          ? "hidden"
          : "container fixed top-0 z-20 flex h-full w-full flex-col bg-rent-bg-gray drop-shadow-xl"
      }`}
    >
      <div className="flex justify-end py-6">
        <button onClick={handleMenuOpen}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-col items-start gap-4 text-2xl font-medium">
        <Link to="/" onClick={handleMenuOpen}>
          Home
        </Link>
        <Link to="wishlist" onClick={handleMenuOpen}>
          Wishlist
        </Link>
        <Link to="posting" onClick={handleMenuOpen}>
          Post Ad
        </Link>
        <Link to="login" onClick={handleMenuOpen}>
          Login
        </Link>
      </div>
    </div>
  );
};
