import { MapPinIcon } from "@heroicons/react/24/solid";
import { useAtomValue } from "jotai";
import moment from "moment";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../shared/date";
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
    return formatDate(updatedAt, now);
  }, [props.updated_at]);

  return (
    <li
      onClick={onClick}
      className="flex min-w-0 max-w-full flex-grow-0 flex-col justify-stretch pb-2 sm:flex-1/2 sm:px-1 lg:flex-1/3"
    >
      <div className="flex h-full flex-col justify-between rounded-md bg-white p-6 shadow-sm hover:shadow-lg">
        <div className="h-48 w-full rounded-lg">
          <img
            className="h-48 w-full rounded-lg object-contain"
            src={props.thumbnail_url}
          />
        </div>
        <div className="px-2 pt-4">
          <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium text-rent-blue">
            {props.title}
          </h2>
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
