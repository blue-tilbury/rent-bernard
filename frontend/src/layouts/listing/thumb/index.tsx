import Divider from "@mui/material/Divider";

import { WishlistEditIcon } from "./WishlistEditIcon";
import { YourAdsEditIcons } from "./YourAdsEditIcons";
import { ListItem } from "../../../types/room.type";

type ThumbProps = {
  room: ListItem;
  page: "wishlist" | "yourAds";
};

export const Thumb = ({ room, page }: ThumbProps) => {
  const isWishlistPage = page === "wishlist";
  const isYourAdsPage = page === "yourAds";

  return (
    <li className="flex justify-between rounded-md bg-white">
      <div className="flex">
        <img
          className="h-40 w-56 rounded-3xl object-cover p-4"
          src={room.thumbnail_url}
        />
        <div className="flex flex-col p-8">
          <div className="flex space-x-2 text-sm">
            <span>{room.city}</span>
            <Divider orientation="vertical" flexItem />
            <span>{room.updated_at} mins ago</span>
          </div>
          <h2 className="pb-4 text-lg font-medium text-rent-blue">{room.title}</h2>
          <p className="text-rent-dark-green">$ {room.price}</p>
        </div>
      </div>
      <div className="flex space-x-5 py-6 pr-14">
        {isWishlistPage && <WishlistEditIcon />}
        {isYourAdsPage && <YourAdsEditIcons id={room.id} />}
      </div>
    </li>
  );
};
