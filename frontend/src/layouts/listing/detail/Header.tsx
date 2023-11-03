import { Divider } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";

import { formatDate } from "../../../shared/date";
import { GetRoom } from "../../../types/room.type";
import { WishlistEditIcon } from "../thumb/WishlistEditIcon";

type HeaderProps = {
  room: GetRoom;
};

//TODO: replace isDefaultFav={true} with the actual value
export const Header = ({ room }: HeaderProps) => {
  const postedAt = useMemo(() => {
    return formatDate(moment(room.created_at), moment());
  }, [room.created_at]);

  return (
    <>
      <h1 className="pb-2 text-2xl font-medium">{room.title}</h1>
      <div className="flex items-center space-x-4 pb-10">
        <h2 className="text-xl font-semibold text-rent-dark-green">${room.price}</h2>
        <Divider orientation="vertical" variant="middle" flexItem />
        <p className=" text-sm">Posted {postedAt}</p>
        <WishlistEditIcon roomId={room.id} isDefaultFav={true} />
      </div>
    </>
  );
};
