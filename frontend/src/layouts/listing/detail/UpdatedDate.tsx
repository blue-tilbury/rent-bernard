import { InformationCircleIcon } from "@heroicons/react/24/outline";

type UpdatedDateProps = {
  updated_at: string;
};

//TODO: replace updated_at with the actual value
export const UpdatedDate = ({ updated_at }: UpdatedDateProps) => {
  return (
    <div className="flex items-center">
      <InformationCircleIcon className="h-5 w-5" />
      <p className="pl-1 text-sm">Updated {updated_at} ago</p>
    </div>
  );
};
