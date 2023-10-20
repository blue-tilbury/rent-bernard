import { PencilIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import AlertDialog from "../../../components/AlertDialog";
import { Id } from "../../../types/common.type";

export const YourAdsEditIcons = ({ id }: Id) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    navigate(`/posting/${id}`);
  };

  return (
    <>
      <PencilIcon onClick={handleClick} className="h-6 w-6" />
      <AlertDialog id={id} />
    </>
  );
};
