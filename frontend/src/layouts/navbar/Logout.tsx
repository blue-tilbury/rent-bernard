import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useNavigate } from "react-router-dom";

import { ErrorMsg } from "../../components/ErrorMsg";
import { useLogoutUser } from "../../hooks/useAxios";
import { errorMessage } from "../../shared/errorMessage";
import { userAtom } from "../../shared/globalStateConfig";

type LogoutProps = {
  type: "menuModal" | "userMenu";
};

export const Logout = ({ type }: LogoutProps) => {
  const setUser = useSetAtom(userAtom);
  const { triggerLogout } = useLogoutUser();
  const navigate = useNavigate();
  const isMenuModal = type === "menuModal";

  const handleLogout = async () => {
    try {
      await triggerLogout();
      setUser(RESET);
      navigate("/");
    } catch (error) {
      <ErrorMsg msg={errorMessage.logoutFail} isReloadBtn={true} />;
    }
  };

  return (
    <li
      onClick={handleLogout}
      className={
        isMenuModal
          ? "flex cursor-pointer items-center gap-3"
          : `flex cursor-pointer list-none items-center gap-3 py-1 pl-2
            hover:rounded-md hover:bg-rent-very-light-gray`
      }
    >
      <ArrowRightOnRectangleIcon className={isMenuModal ? "h-6 w-6" : "h-4 w-4"} />
      <p>Log out</p>
    </li>
  );
};
