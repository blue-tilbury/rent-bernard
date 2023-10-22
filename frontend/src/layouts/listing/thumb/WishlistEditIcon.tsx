import { HeartIcon as OutlinedHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { useAddFav, useDeleteFav } from "../../../hooks/useAxios";

type WishlistEditIconProps = {
  roomId: string;
  isDefaultFav: boolean;
};

export const WishlistEditIcon = ({ roomId, isDefaultFav }: WishlistEditIconProps) => {
  const { triggerAddFav } = useAddFav();
  const { triggerDeleteFav } = useDeleteFav();
  const [isFav, setIsFav] = useState(isDefaultFav);

  const deleteFav = async (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setIsFav(false);
    triggerDeleteFav(roomId);
  };

  const addFav = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setIsFav(true);
    triggerAddFav(roomId);
  };

  return isFav ? (
    <SolidHeartIcon onClick={deleteFav} className="h-6 w-6 text-pink-400" />
  ) : (
    <OutlinedHeartIcon onClick={addFav} className="h-6 w-6 text-rent-gray" />
  );
};
