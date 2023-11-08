import { Divider } from "@mui/material";
import { useAtomValue } from "jotai";
import moment from "moment";
import { useMemo } from "react";

import { formatDate } from "../../../shared/date";
import { loggedIn, userAtom } from "../../../shared/globalStateConfig";
import { GetRoom } from "../../../types/room.type";
import { WishlistEditIcon } from "../thumb/WishlistEditIcon";

type HeaderProps = {
  room: GetRoom;
};

export const Header = ({ room }: HeaderProps) => {
  const user = useAtomValue(userAtom);
  const postedAt = useMemo(() => {
    return formatDate(moment(room.created_at), moment());
  }, [room.created_at]);

  return (
    <>
      <h1 className="pb-2 text-xl font-medium md:text-2xl">{room.title}</h1>
      <div className="flex items-center space-x-4 pb-10">
        <h2 className="text-base font-semibold text-rent-dark-green md:text-xl">
          ${room.price}
        </h2>
        <Divider orientation="vertical" variant="middle" flexItem />
        <p className="text-xs md:text-sm">Posted {postedAt}</p>
        {loggedIn(user) && (
          <WishlistEditIcon roomId={room.id} isDefaultFav={room.is_favorite} />
        )}
      </div>
    </>
  );
};
