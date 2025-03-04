import { InformationCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { useMemo } from "react";

import { formatDate } from "../../../shared/date";

type UpdatedDateProps = {
  updated_at: string;
};

export const UpdatedDate = ({ updated_at }: UpdatedDateProps) => {
  const updatedAt = useMemo(() => {
    return formatDate(moment(updated_at), moment());
  }, [updated_at]);

  return (
    <div className="flex items-center pl-2">
      <InformationCircleIcon className="h-4 w-4" />
      <p className="pl-1 text-xs">Updated {updatedAt}</p>
    </div>
  );
};
