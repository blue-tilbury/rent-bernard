import { Label } from "../../components/form/Label";
import { RadioButton } from "../../components/form/RadioButton";
import { ControlledInputProps } from "../../types/register.type";

export const Furnished = ({ control, error }: ControlledInputProps) => {
  return (
    <div className="flex">
      <Label name="Furnished" required={true} />
      <RadioButton control={control} error={error} name="is_furnished" />
    </div>
  );
};
