import { HeartIcon as OutlinedHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { ErrorMsg } from "../../../components/ErrorMsg";
import { useAddFav, useDeleteFav } from "../../../hooks/useAxios";
import { errorMessage } from "../../../shared/errorMessage";

type WishlistEditIconProps = {
  roomId: string;
  isDefaultFav: boolean;
};

export const WishlistEditIcon = ({ roomId, isDefaultFav }: WishlistEditIconProps) => {
  const { triggerAddFav } = useAddFav();
  const { triggerDeleteFav } = useDeleteFav();
  const [isFav, setIsFav] = useState(isDefaultFav);

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
    } catch (error) {
      <ErrorMsg
        msg={action === "add" ? errorMessage.addFavFail : errorMessage.deleteFavFail}
        isReloadBtn={true}
      />;
    }
  };

  return isFav ? (
    <SolidHeartIcon
      onClick={(e) => handleFavAction(e, "delete")}
      className="h-6 w-6 text-pink-400"
    />
  ) : (
    <OutlinedHeartIcon
      onClick={(e) => handleFavAction(e, "add")}
      className="h-6 w-6 text-rent-gray"
    />
  );
};
