import { useController } from "react-hook-form";

import { FilterType } from "../../types/filter.type";
import { ControlledInputProps } from "../../types/form.type";

export const CheckBox = ({ control, name }: ControlledInputProps<FilterType>) => {
  const { field } = useController({ control, name });
  const label = name === "is_furnished" ? "Furnished" : "Pet Friendly";

  return (
    <label className="flex items-center pb-2 pr-6">
      <input
        type="checkbox"
        {...field}
        value="yes"
        onChange={() => field.onChange(!field.value)}
        className="bg-rent-bg-gray checked:text-rent-green focus:ring-rent-green"
        checked={field.value === true}
      />
      <span className="pl-2">{label}</span>
    </label>
  );
};
