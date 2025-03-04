import {
  // ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Divider from "@mui/material/Divider";

import { Logout } from "./Logout";
import { CustomLink } from "../../components/CustomLink";
import { User } from "../../types/user.type";

type UserMenuProps = {
  user: User;
  isUserMenuOpen: boolean;
  handleClick(): void;
};

export const UserMenu = ({ user, isUserMenuOpen, handleClick }: UserMenuProps) => {
  return (
    <div
      className={`${
        isUserMenuOpen
          ? "absolute right-0 top-14 z-10 w-80 space-y-4 rounded-md bg-rent-most-light-blue p-4"
          : "hidden"
      }`}
    >
      <div className="flex items-center">
        <img src={user.picture} className="mr-4 h-8 w-8 rounded-full" />
        <p className="font-medium">{user.name}</p>
      </div>
      <ul className="rounded-md bg-white p-2">
        <li>
          <CustomLink to="your-ads" type="userMenu" handleClick={handleClick}>
            <ClipboardDocumentListIcon className="h-4 w-4" />
            <p>Your ads</p>
          </CustomLink>
        </li>
        {/* <Divider component="li" role="presentation" sx={{ my: 0.5 }} /> */}
        {/* <li>
          <CustomLink to="your-reviews" type="userMenu" handleClick={handleClick}>
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            <p>Your reviews</p>
          </CustomLink>
        </li> */}
        <Divider component="li" role="presentation" sx={{ my: 0.5 }} />
        <Logout type="userMenu" handleClick={handleClick} />
      </ul>
    </div>
  );
};
