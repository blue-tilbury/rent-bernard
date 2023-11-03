import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type CustomChipProps = {
  roomPropType: boolean;
  name: "Furnished" | "Pet friendly";
};

export const CustomChip = ({ roomPropType, name }: CustomChipProps) => {
  return (
    <div className="flex font-medium">
      {roomPropType ? (
        <CheckIcon className=" h-6 w-6 font-bold text-rent-dark-green" />
      ) : (
        <XMarkIcon className="h-6 w-6 font-bold text-red-600" />
      )}
      <span className="pl-1">{name}</span>
    </div>
  );
};
