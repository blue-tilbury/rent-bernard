import { MapPinIcon } from "@heroicons/react/24/solid";
import { useAtomValue } from "jotai";
import moment from "moment";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { loggedIn, userAtom } from "../../../shared/globalStateConfig";
import { ListItem } from "../../../types/room.type";
import { WishlistEditIcon } from "../thumb/WishlistEditIcon";

export const Gallery = (props: ListItem) => {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  const onClick = () => navigate(`/ads/${props.id}`);
  const postedAt = useMemo(() => {
    const updatedAt = moment(props.updated_at);
    const now = moment();
    const diff = now.diff(updatedAt, "minutes");
    if (diff < 60) {
      return `${diff} mins ago`;
    } else if (60 <= diff && diff < 24 * 60) {
      return `${Math.floor(diff / 60)}h ago`;
    } else {
      return updatedAt.format("YYYY/MM/DD");
    }
  }, [props.updated_at]);

  return (
    <li
      onClick={onClick}
      className="flex flex-1 flex-col justify-stretch pb-2 sm:flex-1/3 sm:px-1"
    >
      <div className="flex h-full flex-col justify-between rounded-md bg-white p-6 shadow-sm hover:shadow-lg">
        <div className="h-3/5 w-full">
          <img
            className="h-full w-full rounded-lg object-cover"
            src={props.thumbnail_url}
          />
        </div>
        <div className="flex flex-col px-2">
          <h2 className="text-lg font-medium text-rent-blue">{props.title}</h2>
          <p className="text-lg font-semibold text-rent-dark-green">${props.price}</p>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 text-rent-gray" />
            <p className="pl-1 text-sm text-rent-gray">{props.city}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-rent-gray">{postedAt}</p>
            {loggedIn(user) && (
              <WishlistEditIcon roomId={props.id} isDefaultFav={props.is_favorite} />
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
