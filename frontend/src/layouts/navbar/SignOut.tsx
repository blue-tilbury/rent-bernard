import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import { userAtom } from "../../pages/Login";
import { User } from "../../types/user.type";

export const SignOut = () => {
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);

  const handleSignOut = () => {
    setUser({} as User);
    navigate("/");
  };

  return (
    <li onClick={handleSignOut} className="flex items-center gap-3 py-2">
      <ArrowRightOnRectangleIcon className="h-4 w-4" />
      <p>Sign out</p>
    </li>
  );
};
