import { HeartIcon as OutlinedHeartIcon, PencilIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertDialog from "../../components/AlertDialog";

type ThumbType = {
  title: string;
  price: number;
  city: string;
  image_urls: string;
  updated_at: string;
};

type ThumbProps = {
  room: ThumbType;
  page: "wishlist" | "yourAds";
};

export const Thumb = ({ room, page }: ThumbProps) => {
  const isWishlistPage = page === "wishlist";
  const isYourAdsPage = page === "yourAds";

  return (
    <li className="flex justify-between rounded-md bg-white">
      <div className="flex">
        <img className="h-40 w-56 rounded-3xl object-cover p-4" src={room.image_urls} />
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
        {isYourAdsPage && <YourAdsEditIcons />}
      </div>
    </li>
  );
};

const WishlistEditIcon = () => {
  const [isFav, setIsFav] = useState(true);

  // TODO: call delete api
  const deleteFav = async () => {
    setIsFav(false);
  };

  // TODO: call add api
  const addFav = () => {
    setIsFav(true);
  };

  return isFav ? (
    <SolidHeartIcon onClick={deleteFav} className="h-6 w-6 text-pink-400" />
  ) : (
    <OutlinedHeartIcon onClick={addFav} className="h-6 w-6 text-pink-400" />
  );
};

const YourAdsEditIcons = () => {
  const navigate = useNavigate();

  return (
    <>
      <PencilIcon onClick={() => navigate("/posting")} className="h-6 w-6" />
      <AlertDialog />
    </>
  );
};
