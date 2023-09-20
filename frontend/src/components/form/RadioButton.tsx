import { useController } from "react-hook-form";

import { ControlledInputProps } from "../../types/register.type";

export const RadioButton = (props: ControlledInputProps) => {
  const { field } = useController(props);

  return (
    <div className="flex flex-col pl-3">
      <div className="flex">
        <label className="pr-6">
          <input
            type="radio"
            {...field}
            value="Yes"
            onChange={() => field.onChange(true)}
            className="mr-1 bg-rent-background-gray checked:text-rent-green focus:ring-rent-green"
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            {...field}
            value="No"
            onChange={() => field.onChange(false)}
            className="mr-1 bg-rent-background-gray checked:text-rent-green focus:ring-rent-green"
          />
          No
        </label>
      </div>
      {props.error?.message && (
        <p className="text-red-600 text-sm pl-1 pt-1">{props.error?.message}</p>
      )}
    </div>
  );
};
