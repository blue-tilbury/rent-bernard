import Divider from "@mui/material/Divider";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { WishlistEditIcon } from "./WishlistEditIcon";
import { YourAdsEditIcons } from "./YourAdsEditIcons";
import { formatDate } from "../../../shared/date";
import { ListItem } from "../../../types/room.type";

type ThumbProps = {
  room: ListItem;
  page: "wishlist" | "yourAds";
};

export const Thumb = ({ room, page }: ThumbProps) => {
  const navigate = useNavigate();
  const isWishlistPage = page === "wishlist";
  const isYourAdsPage = page === "yourAds";
  const updatedAt = formatDate(moment(room.updated_at), moment());

  const onClick = () => navigate(`/ads/${room.id}`);

  return (
    <li
      onClick={onClick}
      className="flex items-center rounded-md bg-white md:items-start"
    >
      <img
        className="h-32 w-32 rounded-3xl object-cover p-4 md:h-40 md:w-56"
        src={room.thumbnail_url}
      />
      <div className="flex flex-1 flex-col justify-between px-4 py-6 md:flex-row md:p-8">
        <div>
          <div className="flex space-x-2 text-xs md:text-sm">
            <span>{room.city}</span>
            <Divider orientation="vertical" flexItem />
            <span>{updatedAt}</span>
          </div>
          <h2 className="pb-2 font-medium text-rent-blue md:pb-4 md:text-lg">
            {room.title}
          </h2>
          <p className="text-sm text-rent-dark-green md:text-base">$ {room.price}</p>
        </div>
        <div className="flex justify-end space-x-3 pr-4 pt-2 md:space-x-5 md:pt-0 lg:pr-14">
          {isWishlistPage && <WishlistEditIcon roomId={room.id} isDefaultFav={true} />}
          {isYourAdsPage && <YourAdsEditIcons id={room.id} />}
        </div>
      </div>
    </li>
  );
};
