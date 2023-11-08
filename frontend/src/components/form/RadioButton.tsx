import { useController } from "react-hook-form";

import { ControlledInputProps } from "../../types/form.type";
import { PostRoom } from "../../types/room.type";

export const RadioButton = ({ control, name, error }: ControlledInputProps<PostRoom>) => {
  const { field } = useController({ control, name });

  return (
    <div className="flex flex-col text-sm md:pl-3 md:text-base">
      <div className="flex">
        <label className="pr-6">
          <input
            type="radio"
            {...field}
            value="Yes"
            onChange={() => field.onChange(true)}
            className="mr-1 bg-rent-bg-gray checked:text-rent-green focus:ring-rent-green"
            checked={field.value === true}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            {...field}
            value="No"
            onChange={() => field.onChange(false)}
            className="mr-1 bg-rent-bg-gray checked:text-rent-green focus:ring-rent-green"
            checked={field.value === false}
          />
          No
        </label>
      </div>
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error?.message}</p>
      )}
    </div>
  );
};
