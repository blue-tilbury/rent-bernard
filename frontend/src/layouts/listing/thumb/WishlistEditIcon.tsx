import { HeartIcon as OutlinedHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export const WishlistEditIcon = () => {
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
