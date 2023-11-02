import { Label } from "../../components/form/Label";
import { RadioButton } from "../../components/form/RadioButton";
import { ControlledInputProps } from "../../types/form.type";
import { PostRoom } from "../../types/room.type";

export const Furnished = ({ control, error }: ControlledInputProps<PostRoom>) => {
  return (
    <div className="flex">
      <Label name="Furnished" required={true} />
      <RadioButton control={control} name="is_furnished" error={error} />
    </div>
  );
};
