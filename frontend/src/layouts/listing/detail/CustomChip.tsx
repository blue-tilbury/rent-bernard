import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type CustomChipProps = {
  roomPropType: boolean;
  name: "Furnished" | "Pet friendly";
};

export const CustomChip = ({ roomPropType, name }: CustomChipProps) => {
  return (
    <div className="flex items-center text-sm font-medium md:text-base">
      {roomPropType ? (
        <CheckIcon className="h-5 w-5 font-bold text-rent-dark-green md:h-6 md:w-6" />
      ) : (
        <XMarkIcon className="h-5 w-5 font-bold text-red-600 md:h-6 md:w-6" />
      )}
      <span className="pl-1">{name}</span>
    </div>
  );
};
