import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import { useLogoutUser } from "../../hooks/useAxios";
import { userAtom } from "../../pages/Login";
import { User } from "../../types/user.type";

export const Logout = () => {
  const setUser = useSetAtom(userAtom);
  const { triggerLogout } = useLogoutUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await triggerLogout();
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
