import { HeartIcon as OutlinedHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAddFav, useDeleteFav } from "../../../hooks/useAxios";

type WishlistEditIconProps = {
  roomId: string;
  isDefaultFav: boolean;
};

export const WishlistEditIcon = ({ roomId, isDefaultFav }: WishlistEditIconProps) => {
  const { triggerAddFav } = useAddFav();
  const { triggerDeleteFav } = useDeleteFav();
  const [isFav, setIsFav] = useState(isDefaultFav);
  const navigate = useNavigate();

  const handleFavAction = async (
    e: React.MouseEvent<SVGSVGElement>,
    action: "add" | "delete",
  ) => {
    e.stopPropagation();
    setIsFav(action === "add");
    try {
      if (action === "add") {
        await triggerAddFav(roomId);
      } else {
        await triggerDeleteFav(roomId);
      }
    } catch (e) {
      navigate("/error");
    }
  };

  return isFav ? (
    <SolidHeartIcon
      onClick={(e) => handleFavAction(e, "delete")}
      className="h-5 w-5 text-pink-500 md:h-6 md:w-6"
    />
  ) : (
    <OutlinedHeartIcon
      onClick={(e) => handleFavAction(e, "add")}
      className="h-5 w-5 text-rent-gray md:h-6 md:w-6"
    />
  );
};
