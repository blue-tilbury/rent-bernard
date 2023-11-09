import {
  ArrowLeftOnRectangleIcon,
  // ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  HomeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

import { PagePath } from "../../types/common.type";

type MenuModalLinkProps = {
  to: PagePath;
  handleClick(): void;
};

export const MenuModalLink = ({ to, handleClick }: MenuModalLinkProps) => {
  let icon: React.ReactNode;
  // let title: "Home" | "Login" | "Wishlist" | "Post Ad" | "Your Ads" | "Your Reviews";
  let title: "Home" | "Login" | "Wishlist" | "Post Ad" | "Your Ads";

  switch (to) {
    case "/":
      icon = <HomeIcon className="h-6 w-6" />;
      title = "Home";
      break;
    case "login":
      icon = <ArrowLeftOnRectangleIcon className="h-6 w-6" />;
      title = "Login";
      break;
    case "wishlist":
      icon = <HeartIcon className="h-6 w-6" />;
      title = "Wishlist";
      break;
    case "posting":
      icon = <PencilSquareIcon className="h-6 w-6" />;
      title = "Post Ad";
      break;
    case "your-ads":
      icon = <ClipboardDocumentListIcon className="h-6 w-6" />;
      title = "Your Ads";
      break;
    // case "your-reviews":
    //   icon = <ChatBubbleLeftRightIcon className="h-6 w-6" />;
    //   title = "Your Reviews";
    //   break;
  }

  return (
    <NavLink to={to} onClick={handleClick}>
      {({ isActive }) => (
        <div className="flex items-center gap-3">
          {icon}
          <span className={isActive ? "text-rent-blue" : ""}>{title}</span>
        </div>
      )}
    </NavLink>
  );
};
