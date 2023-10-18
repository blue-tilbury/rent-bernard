import { useAtomValue } from "jotai";
import { useState } from "react";

import { UserMenu } from "./UserMenu";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { userAtom } from "../../shared/globalStateConfig";

export const AccountIcon = () => {
  const user = useAtomValue(userAtom);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const ref = useOutsideClick(setIsUserMenuOpen, false);

  return (
    <div ref={ref} className="relative flex">
      <button onClick={() => setIsUserMenuOpen((prev) => !prev)}>
        <img src={user.picture} className="h-8 w-8 rounded-full" />
      </button>
      <UserMenu user={user} isUserMenuOpen={isUserMenuOpen} />
    </div>
  );
};
