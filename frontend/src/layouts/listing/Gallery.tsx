import { MapPinIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

import { ListItem } from "../../types/room.type";

export const Gallery = (props: ListItem) => {
  const navigate = useNavigate();
  const onClick = () => navigate(`/ads/${props.id}`);

  return (
    <li onClick={onClick} className="flex flex-1 flex-col py-1 sm:flex-1/3 sm:px-1">
      <div className="rounded-md bg-white p-6 shadow-sm hover:shadow-lg">
        <img className="rounded-lg" src={props.thumbnail_url} />
        <div className="flex flex-col px-2 pt-4">
          <h2 className="text-lg font-medium text-rent-blue">{props.title}</h2>
          <p className="text-lg font-semibold text-rent-dark-green">${props.price}</p>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 text-rent-gray" />
            <p className="pl-1 text-sm text-rent-gray">{props.city}</p>
          </div>
          <p className="text-sm text-rent-gray">{props.updated_at} mins ago</p>
        </div>
      </div>
    </li>
  );
};
