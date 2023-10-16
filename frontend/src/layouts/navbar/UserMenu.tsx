import { ChatBubbleLeftRightIcon, HomeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

import { Logout } from "./Logout";
import { User } from "../../types/user.type";

type UserMenuProps = {
  user: User;
  isUserMenuOpen: boolean;
};

export const UserMenu = ({ user, isUserMenuOpen }: UserMenuProps) => {
  return (
    <div
      className={`${
        isUserMenuOpen
          ? "absolute right-0 top-14 w-80 space-y-4 rounded-md bg-slate-200 p-4"
          : "hidden"
      }`}
    >
      <div className="flex items-center">
        <img src={user.picture} className="mr-4 h-8 w-8 rounded-full" />
        <p className="font-medium">{user.name}</p>
      </div>
      <ul className="divide-y rounded-md bg-white px-2">
        <Link to="/your-ads" className="flex items-center gap-3 py-2">
          <HomeIcon className="h-4 w-4" />
          <p>Your ads</p>
        </Link>
        <li className="flex items-center gap-3 py-2">
          <ChatBubbleLeftRightIcon className="h-4 w-4" />
          <p>Your reviews</p>
        </li>
        <Logout />
      </ul>
    </div>
  );
};
